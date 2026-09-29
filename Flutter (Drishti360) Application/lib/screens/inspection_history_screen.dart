import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../router/app_router.dart';

class HistoryRecord {
  final String id;
  final String ngoName;
  final String location;
  final String date;
  final String type;
  final String status;
  final String remarks;

  HistoryRecord({
    required this.id,
    required this.ngoName,
    required this.location,
    required this.date,
    required this.type,
    required this.status,
    required this.remarks,
  });
}

class InspectionHistoryScreen extends StatefulWidget {
  const InspectionHistoryScreen({super.key});

  @override
  State<InspectionHistoryScreen> createState() => _InspectionHistoryScreenState();
}

class _InspectionHistoryScreenState extends State<InspectionHistoryScreen> {
  // CSS Colors matching insp_histroy(Dashboard).css
  static const Color primaryBlue = Color(0xFF0B3D91);
  static const Color bgColor = Color(0xFFF3F4F6); // modern gray background
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textMuted = Color(0xFF64748B);
  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color successGreen = Color(0xFF10B981);
  static const Color successLight = Color(0xFFD1FAE5);
  static const Color badgeBg = Color(0xFFEFF6FF);
  static const Color badgeText = Color(0xFF3B82F6);
  static const Color chipActiveBg = Color(0xFF0B3D91);
  static const Color chipInactiveBg = Color(0xFFFFFFFF);

  // Filters
  String _searchQuery = '';
  String _activeFilter = 'All'; // All, Scheduled, Surprise
  String _sortBy = 'newest';

  final List<HistoryRecord> _allRecords = [
    HistoryRecord(
      id: 'INS-001',
      ngoName: 'ABC Welfare Foundation',
      location: 'Pune, Maharashtra',
      date: '15 Aug 2026',
      type: 'Scheduled',
      status: 'Completed',
      remarks: 'All compliance checks passed successfully.',
    ),
    HistoryRecord(
      id: 'INS-002',
      ngoName: 'Rural Upliftment Society',
      location: 'Nashik, Maharashtra',
      date: '10 Aug 2026',
      type: 'Surprise',
      status: 'Completed',
      remarks: 'Minor issues found in documentation.',
    ),
    HistoryRecord(
      id: 'INS-003',
      ngoName: 'Global Health NGO',
      location: 'Mumbai, Maharashtra',
      date: '22 Jul 2026',
      type: 'Scheduled',
      status: 'Completed',
      remarks: 'Excellent facility management.',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    // Apply filters
    var filtered = _allRecords.where((r) {
      bool matchesSearch = r.ngoName.toLowerCase().contains(_searchQuery.toLowerCase()) ||
                           r.location.toLowerCase().contains(_searchQuery.toLowerCase());
      bool matchesType = _activeFilter == 'All' || r.type == _activeFilter;
      return matchesSearch && matchesType;
    }).toList();

    // Apply sorting
    filtered.sort((a, b) {
      if (_sortBy == 'newest') {
        return b.date.compareTo(a.date);
      } else {
        return a.date.compareTo(b.date);
      }
    });

    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 1,
        shadowColor: Colors.black12,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: textDark, size: 24),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.dashboard);
            }
          },
        ),
        title: Text(
          'Inspection History',
          style: GoogleFonts.nunito(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: textDark,
          ),
        ),
        centerTitle: false,
      ),
      body: CustomScrollView(
        slivers: [
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // PAGE INTRODUCTION
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Past Inspections',
                              style: GoogleFonts.nunito(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: primaryBlue,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              'View your completed inspection records.',
                              style: GoogleFonts.nunito(
                                fontSize: 14,
                                fontWeight: FontWeight.w500,
                                color: textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
                        decoration: BoxDecoration(
                          color: cardBg,
                          borderRadius: BorderRadius.circular(12),
                          border: Border.all(color: borderColor),
                          boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 2))],
                        ),
                        child: Column(
                          children: [
                            Text(
                              '${filtered.length}',
                              style: GoogleFonts.nunito(
                                fontSize: 24,
                                fontWeight: FontWeight.w800,
                                color: primaryBlue,
                              ),
                            ),
                            Text(
                              'Total Records',
                              style: GoogleFonts.nunito(
                                fontSize: 11,
                                fontWeight: FontWeight.w700,
                                color: textMuted,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // CONTROLS SECTION
                  // Search Bar
                  TextField(
                    onChanged: (val) => setState(() => _searchQuery = val),
                    style: GoogleFonts.nunito(fontSize: 15, color: textDark, fontWeight: FontWeight.w600),
                    decoration: InputDecoration(
                      hintText: 'Search inspection history...',
                      hintStyle: GoogleFonts.nunito(color: textMuted, fontWeight: FontWeight.w500),
                      prefixIcon: const Icon(Icons.search, color: textMuted),
                      filled: true,
                      fillColor: Colors.white,
                      contentPadding: const EdgeInsets.symmetric(vertical: 14),
                      border: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: borderColor),
                      ),
                      enabledBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: borderColor),
                      ),
                      focusedBorder: OutlineInputBorder(
                        borderRadius: BorderRadius.circular(12),
                        borderSide: const BorderSide(color: primaryBlue, width: 1.5),
                      ),
                    ),
                  ),
                  const SizedBox(height: 16),

                  // Filters & Sort
                  Row(
                    children: [
                      Expanded(
                        child: SingleChildScrollView(
                          scrollDirection: Axis.horizontal,
                          child: Row(
                            children: [
                              _buildFilterChip('All'),
                              _buildFilterChip('Scheduled'),
                              _buildFilterChip('Surprise'),
                            ],
                          ),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 12),
                        height: 38,
                        decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: borderColor),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.sort, size: 16, color: textMuted),
                            const SizedBox(width: 8),
                            DropdownButtonHideUnderline(
                              child: DropdownButton<String>(
                                value: _sortBy,
                                icon: const Icon(Icons.arrow_drop_down, color: textMuted),
                                style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark),
                                onChanged: (String? newValue) {
                                  if (newValue != null) {
                                    setState(() => _sortBy = newValue);
                                  }
                                },
                                items: const [
                                  DropdownMenuItem(value: 'newest', child: Text('Newest First')),
                                  DropdownMenuItem(value: 'oldest', child: Text('Oldest First')),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                ],
              ),
            ),
          ),

          // LIST OF CARDS
          if (filtered.isEmpty)
            SliverFillRemaining(
              hasScrollBody: false,
              child: Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Icon(Icons.history_toggle_off, size: 48, color: textMuted),
                    const SizedBox(height: 16),
                    Text(
                      'No Inspection Records Found',
                      style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w700, color: textDark),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Try changing your search or filter criteria.',
                      textAlign: TextAlign.center,
                      style: GoogleFonts.nunito(fontSize: 13, color: textMuted),
                    ),
                    const SizedBox(height: 24),
                    ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFFF1F5F9),
                        foregroundColor: textDark,
                        elevation: 0,
                      ),
                      onPressed: () {
                        setState(() {
                          _activeFilter = 'All';
                          _searchQuery = '';
                        });
                      },
                      child: Text('Clear Filters', style: GoogleFonts.nunito(fontWeight: FontWeight.w700)),
                    )
                  ],
                ),
              ),
            )
          else
            SliverPadding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              sliver: SliverList(
                delegate: SliverChildBuilderDelegate(
                  (context, index) => _buildRecordCard(filtered[index]),
                  childCount: filtered.length,
                ),
              ),
            ),
            
          const SliverPadding(padding: EdgeInsets.only(bottom: 30)),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label) {
    bool isActive = _activeFilter == label;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: () => setState(() => _activeFilter = label),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          height: 38,
          decoration: BoxDecoration(
            color: isActive ? chipActiveBg : chipInactiveBg,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: isActive ? chipActiveBg : borderColor),
            boxShadow: isActive ? const [BoxShadow(color: Color(0x260B3D91), blurRadius: 4, offset: Offset(0, 2))] : null,
          ),
          child: Center(
            child: Text(
              label,
              style: GoogleFonts.nunito(
                fontSize: 13,
                fontWeight: FontWeight.w700,
                color: isActive ? Colors.white : textMuted,
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildRecordCard(HistoryRecord record) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
        boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 8, offset: Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Card Header
          Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  record.id,
                  style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w700, color: textMuted),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: successLight,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.check_circle, size: 12, color: successGreen),
                      const SizedBox(width: 4),
                      Text(
                        record.status,
                        style: GoogleFonts.nunito(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: successGreen,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1, color: borderColor),
          
          // Card Body
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  record.ngoName,
                  style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w800, color: textDark),
                ),
                const SizedBox(height: 6),
                Row(
                  children: [
                    const Icon(Icons.location_on, size: 14, color: textMuted),
                    const SizedBox(width: 4),
                    Text(
                      record.location,
                      style: GoogleFonts.nunito(fontSize: 13, color: textMuted),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Details Grid
                Row(
                  children: [
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(8)),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Date', style: GoogleFonts.nunito(fontSize: 11, color: textMuted)),
                            const SizedBox(height: 2),
                            Text(record.date, style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark)),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Container(
                        padding: const EdgeInsets.all(12),
                        decoration: BoxDecoration(color: bgColor, borderRadius: BorderRadius.circular(8)),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text('Type', style: GoogleFonts.nunito(fontSize: 11, color: textMuted)),
                            const SizedBox(height: 2),
                            Text(record.type, style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark)),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 16),
                
                // Remarks
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(8),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.comment, size: 14, color: textMuted),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          record.remarks,
                          style: GoogleFonts.nunito(fontSize: 13, color: textDark, fontStyle: FontStyle.italic),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          const Divider(height: 1, thickness: 1, color: borderColor),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                TextButton(
                  onPressed: () {},
                  style: TextButton.styleFrom(
                    foregroundColor: primaryBlue,
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text('VIEW DETAILS', style: GoogleFonts.nunito(fontWeight: FontWeight.w800, fontSize: 12)),
                      const SizedBox(width: 4),
                      const Icon(Icons.arrow_forward, size: 16),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
