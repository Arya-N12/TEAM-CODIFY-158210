import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'dart:io';
import 'package:image_picker/image_picker.dart';
import 'package:geolocator/geolocator.dart';
import 'package:flutter/services.dart';

import '../router/app_router.dart';

class _ChecklistItem {
  final int id;
  final String text;
  bool? status; // null=unanswered, true=pass, false=fail
  _ChecklistItem({required this.id, required this.text, this.status});
}

class _InspectionSection {
  final int id;
  final String title;
  final String description;
  final List<_ChecklistItem> items;
  _InspectionSection({required this.id, required this.title, required this.description, required this.items});
}

class StartInspectionScreen extends StatefulWidget {
  const StartInspectionScreen({super.key});

  @override
  State<StartInspectionScreen> createState() => _StartInspectionScreenState();
}

class _StartInspectionScreenState extends State<StartInspectionScreen> {
  static const Color primaryBlue = Color(0xFF09377A);
  static const Color bgColor = Color(0xFFF4F7FB);
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color textDark = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);
  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color danger = Color(0xFFDC2626);
  static const Color success = Color(0xFF16A34A);

  String _locationStatus = 'Awaiting geo-tag verification...';
  bool _isFetchingLocation = false;
  final ImagePicker _picker = ImagePicker();

  List<_InspectionSection> sections = [
    _InspectionSection(
      id: 1,
      title: 'Infrastructure & Facilities',
      description: 'Inspection of infrastructure, cleanliness, safety and available facilities.',
      items: [
        _ChecklistItem(id: 1, text: 'Building condition'),
        _ChecklistItem(id: 2, text: 'Cleanliness and hygiene'),
        _ChecklistItem(id: 3, text: 'Fire safety equipment'),
        _ChecklistItem(id: 4, text: 'Drinking water facility'),
        _ChecklistItem(id: 5, text: 'Toilets and sanitation'),
        _ChecklistItem(id: 6, text: 'Electricity availability'),
        _ChecklistItem(id: 7, text: 'Emergency exits'),
        _ChecklistItem(id: 8, text: 'Accessibility facilities'),
      ]
    )
  ];

  int get totalItems => sections.fold(0, (sum, sec) => sum + sec.items.length);
  int get completedItems => sections.fold(0, (sum, sec) => sum + sec.items.where((i) => i.status != null).length);
  double get progressPercent => totalItems == 0 ? 0 : completedItems / totalItems;

  Future<void> _fetchLocation() async {
    setState(() => _isFetchingLocation = true);
    try {
      bool serviceEnabled = await Geolocator.isLocationServiceEnabled();
      if (!serviceEnabled) {
        setState(() => _locationStatus = 'Location services are disabled.');
        return;
      }
      LocationPermission permission = await Geolocator.checkPermission();
      if (permission == LocationPermission.denied) {
        permission = await Geolocator.requestPermission();
      }
      if (permission == LocationPermission.denied || permission == LocationPermission.deniedForever) {
        setState(() => _locationStatus = 'Location permission denied.');
        return;
      }
      Position position = await Geolocator.getCurrentPosition(desiredAccuracy: LocationAccuracy.high, timeLimit: const Duration(seconds: 10));
      setState(() => _locationStatus = 'Lat: , Lng: ');
    } catch (e) {
      setState(() => _locationStatus = 'Failed to fetch location: Timeout or Error.');
    } finally {
      setState(() => _isFetchingLocation = false);
    }
  }

  static const _geoChannel = MethodChannel('com.inspex.inspec1dart/geotag');
  Future<void> _uploadEvidence() async {
    try {
      final String? imagePath = await _geoChannel.invokeMethod('launchCamera');
      if (!mounted) return;
      if (imagePath != null) {
        ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Geo-tagged evidence saved: $imagePath')));
      }
    } catch (e) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Error: $e')));
    }
  }

  void _showNewSectionModal() {
    final titleCtrl = TextEditingController();
    final descCtrl = TextEditingController();
    final itemsCtrl = TextEditingController();

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: Text('Create New Section', style: GoogleFonts.nunito(fontWeight: FontWeight.bold)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(controller: titleCtrl, decoration: const InputDecoration(labelText: 'Section Title', hintText: 'e.g. Infrastructure & Facilities')),
              const SizedBox(height: 10),
              TextField(controller: descCtrl, decoration: const InputDecoration(labelText: 'Description')),
              const SizedBox(height: 10),
              TextField(controller: itemsCtrl, decoration: const InputDecoration(labelText: 'Checklist Items (One per line)'), maxLines: 3),
            ],
          ),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          ElevatedButton(
            onPressed: () {
              if (titleCtrl.text.trim().isEmpty || itemsCtrl.text.trim().isEmpty) {
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Title and at least one item are required')));
                return;
              }
              final lines = itemsCtrl.text.split('\n').where((l) => l.trim().isNotEmpty).toList();
              final newItems = lines.asMap().entries.map((e) => _ChecklistItem(id: DateTime.now().millisecondsSinceEpoch + e.key, text: e.value.trim())).toList();
              setState(() {
                sections.add(_InspectionSection(
                  id: DateTime.now().millisecondsSinceEpoch,
                  title: titleCtrl.text.trim(),
                  description: descCtrl.text.trim(),
                  items: newItems,
                ));
              });
              Navigator.pop(ctx);
            }, 
            child: const Text('Create Section')
          ),
        ],
      ),
    );
  }

  void _showChecklistModal(_InspectionSection section) {
    showDialog(
      context: context,
      builder: (ctx) => StatefulBuilder(
        builder: (ctx, setStateModal) {
          return AlertDialog(
            title: Text(section.title, style: GoogleFonts.nunito(fontWeight: FontWeight.bold, fontSize: 18)),
            content: SizedBox(
              width: double.maxFinite,
              child: ListView.separated(
                shrinkWrap: true,
                itemCount: section.items.length,
                separatorBuilder: (c, i) => const Divider(),
                itemBuilder: (c, i) {
                  final item = section.items[i];
                  return Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item.text, style: GoogleFonts.nunito(fontSize: 14)),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            ChoiceChip(
                              label: const Text('Pass'),
                              selected: item.status == true,
                              selectedColor: Colors.green.withOpacity(0.2),
                              onSelected: (val) {
                                setStateModal(() => item.status = val ? true : null);
                                setState(() {});
                              },
                            ),
                            const SizedBox(width: 8),
                            ChoiceChip(
                              label: const Text('Fail'),
                              selected: item.status == false,
                              selectedColor: Colors.red.withOpacity(0.2),
                              onSelected: (val) {
                                setStateModal(() => item.status = val ? false : null);
                                setState(() {});
                              },
                            ),
                          ],
                        )
                      ],
                    ),
                  );
                }
              ),
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Close')),
            ],
          );
        }
      ),
    );
  }

  Widget _buildAccordion({required String title, required FaIconData icon, required Color iconColor, required Widget child}) {
    return Card(
      color: cardBg,
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 12),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: const BorderSide(color: borderColor)),
      child: ExpansionTile(
        leading: FaIcon(icon, color: iconColor, size: 20),
        title: Text(title, style: GoogleFonts.nunito(fontWeight: FontWeight.w700, color: textDark)),
        childrenPadding: const EdgeInsets.all(16).copyWith(top: 0),
        children: [child],
      ),
    );
  }

  Widget _buildInfoItem(FaIconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          FaIcon(icon, size: 16, color: textMuted),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: GoogleFonts.nunito(fontSize: 12, color: textMuted)),
                const SizedBox(height: 2),
                Text(value, style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w600, color: textDark)),
              ],
            ),
          )
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: primaryBlue,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new_rounded, color: Colors.white, size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.home);
            }
          },
        ),
        title: Text('Active Inspection', style: GoogleFonts.nunito(fontSize: 19, fontWeight: FontWeight.w700, color: Colors.white)),
        centerTitle: false,
      ),
      body: Column(
        children: [
          Container(
            color: cardBg,
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Overall Progress', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w600, color: textDark)),
                    Text('%', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w800, color: primaryBlue)),
                  ],
                ),
                const SizedBox(height: 8),
                LinearProgressIndicator(value: progressPercent, backgroundColor: borderColor, color: primaryBlue, minHeight: 6),
                const SizedBox(height: 8),
                Text(' /  Checklist Items Completed', style: GoogleFonts.nunito(fontSize: 12, color: textMuted)),
              ],
            ),
          ),
          const Divider(height: 1, color: borderColor),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.all(16),
              children: [
                // Inspection Details
                _buildAccordion(
                  title: 'Inspection Details & Team',
                  icon: FontAwesomeIcons.circleInfo,
                  iconColor: primaryBlue,
                  child: Column(
                    children: [
                      _buildInfoItem(FontAwesomeIcons.clipboardList, 'Assignment ID', 'INS-20260920-045'),
                      _buildInfoItem(FontAwesomeIcons.buildingColumns, 'Institution Name', 'ABCD Welfare Institute'),
                      _buildInfoItem(FontAwesomeIcons.users, 'Inspection Team', 'Rajesh Kumar (Lead), Amit Patel'),
                    ],
                  )
                ),

                // Location
                _buildAccordion(
                  title: 'Location Verification',
                  icon: FontAwesomeIcons.locationDot,
                  iconColor: primaryBlue,
                  child: Column(
                    children: [
                      OutlinedButton.icon(
                        onPressed: _fetchLocation,
                        icon: _isFetchingLocation 
                            ? const SizedBox(width: 16, height: 16, child: CircularProgressIndicator(strokeWidth: 2))
                            : const FaIcon(FontAwesomeIcons.locationCrosshairs, size: 16),
                        label: Text(_isFetchingLocation ? 'Fetching...' : 'Fetch Current GPS Location'),
                        style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 44)),
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(8)),
                        child: Row(
                          children: [
                            const FaIcon(FontAwesomeIcons.mapLocationDot, color: textMuted, size: 16),
                            const SizedBox(width: 12),
                            Expanded(child: Text(_locationStatus, style: GoogleFonts.nunito(fontSize: 13, color: textDark))),
                          ],
                        ),
                      )
                    ],
                  )
                ),

                const SizedBox(height: 16),
                
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Inspection Sections', style: GoogleFonts.nunito(fontSize: 18, fontWeight: FontWeight.w800, color: textDark)),
                    ElevatedButton.icon(
                      onPressed: _showNewSectionModal,
                      icon: const FaIcon(FontAwesomeIcons.plus, size: 12),
                      label: const Text('New Section'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFE0F2FE),
                        foregroundColor: const Color(0xFF0284C7),
                        elevation: 0,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                // Dynamic Sections List
                ...sections.map((section) {
                  int secTotal = section.items.length;
                  int secDone = section.items.where((i) => i.status != null).length;
                  double secProgress = secTotal == 0 ? 0 : secDone / secTotal;
                  return Card(
                    color: cardBg,
                    elevation: 0,
                    margin: const EdgeInsets.only(bottom: 12),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12), side: const BorderSide(color: borderColor)),
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(section.title, style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.bold, color: textDark)),
                          const SizedBox(height: 4),
                          Text(section.description, style: GoogleFonts.nunito(fontSize: 13, color: textMuted)),
                          const SizedBox(height: 12),
                          Row(
                            children: [
                              Expanded(
                                child: LinearProgressIndicator(value: secProgress, backgroundColor: borderColor, color: primaryBlue),
                              ),
                              const SizedBox(width: 12),
                              Text('%', style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.bold, color: textMuted)),
                            ],
                          ),
                          const SizedBox(height: 12),
                          SizedBox(
                            width: double.infinity,
                            child: OutlinedButton(
                              onPressed: () => _showChecklistModal(section),
                              child: const Text('Open Checklist'),
                            ),
                          )
                        ],
                      ),
                    ),
                  );
                }),

                const SizedBox(height: 16),

                // Evidence
                _buildAccordion(
                  title: 'Evidence Collection',
                  icon: FontAwesomeIcons.camera,
                  iconColor: primaryBlue,
                  child: OutlinedButton.icon(
                    onPressed: _uploadEvidence,
                    icon: const FaIcon(FontAwesomeIcons.upload, size: 16),
                    label: const Text('Upload Photos / Documents'),
                    style: OutlinedButton.styleFrom(minimumSize: const Size(double.infinity, 44)),
                  )
                ),

                // Observations
                _buildAccordion(
                  title: 'Observations & Irregularities',
                  icon: FontAwesomeIcons.triangleExclamation,
                  iconColor: danger,
                  child: TextField(
                    maxLines: 4,
                    maxLength: 2500, // Roughly 500 words
                    decoration: InputDecoration(
                      hintText: 'Record any major irregularities found (max ~500 words)...',
                      hintStyle: GoogleFonts.nunito(fontSize: 14, color: textMuted),
                      border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: borderColor)),
                    ),
                  )
                ),
              ],
            ),
          ),
          
          // Action Bar
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: cardBg,
              border: Border(top: BorderSide(color: borderColor)),
            ),
            child: Row(
              children: [
                Expanded(
                  child: OutlinedButton(
                    onPressed: () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Progress saved globally')));
                    },
                    style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                    child: Text('Save Progress', style: GoogleFonts.nunito(fontWeight: FontWeight.bold)),
                  )
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: ElevatedButton(
                    onPressed: progressPercent == 1.0 ? () {
                      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Report submitted successfully')));
                    } : null,
                    style: ElevatedButton.styleFrom(backgroundColor: primaryBlue, padding: const EdgeInsets.symmetric(vertical: 16)),
                    child: Text('Submit', style: GoogleFonts.nunito(fontWeight: FontWeight.bold, color: Colors.white)),
                  )
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}

