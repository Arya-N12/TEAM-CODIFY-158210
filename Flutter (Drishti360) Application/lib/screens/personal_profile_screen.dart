import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../router/app_router.dart';

class PersonalProfileScreen extends StatefulWidget {
  const PersonalProfileScreen({super.key});

  @override
  State<PersonalProfileScreen> createState() => _PersonalProfileScreenState();
}

class _PersonalProfileScreenState extends State<PersonalProfileScreen> {
  static const Color primaryBlue = Color(0xFF14345C); // Matched to dashboard header
  static const Color bgColor = Color(0xFFF8FAFC);
  static const Color textDark = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);
  static const Color borderColor = Color(0xFFE2E8F0);

  final Map<String, TextEditingController> _controllers = {
    'Officer Name': TextEditingController(text: 'Rajesh Kumar'),
    'Officer ID': TextEditingController(text: 'PMU-INS-10294'),
    'Officer Post / Designation': TextEditingController(text: 'Inspection Officer'),
    'Inspection Team / PMU': TextEditingController(text: 'PMU Inspection Team'),
    'Assigned District / Area': TextEditingController(text: 'Pune District'),
    'Official Email (Gmail)': TextEditingController(text: 'rajesh.kumar.pmu@gmail.com'),
    'Contact Number': TextEditingController(text: '+91 98765 43210'),
  };

  final Map<String, bool> _isEditing = {};

  @override
  void initState() {
    super.initState();
    for (var key in _controllers.keys) {
      _isEditing[key] = false;
    }
  }

  @override
  void dispose() {
    for (var controller in _controllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: bgColor,
      appBar: AppBar(
        backgroundColor: primaryBlue,
        elevation: 0,
        leading: IconButton(
          icon: const FaIcon(FontAwesomeIcons.chevronLeft, color: Colors.white, size: 20),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.dashboard);
            }
          },
        ),
        title: Text(
          'Personal Information',
          style: GoogleFonts.nunito(
            fontSize: 20,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
        centerTitle: false,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Container(
            width: double.infinity,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(16),
              boxShadow: [
                BoxShadow(
                  color: textDark.withValues(alpha: 0.05),
                  blurRadius: 15,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Personal Details',
                  style: GoogleFonts.nunito(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: primaryBlue,
                  ),
                ),
                const SizedBox(height: 24),
                ..._controllers.keys.map((label) {
                  bool isLast = label == 'Contact Number';
                  return _buildFieldSubbox(label, isLast);
                }),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFieldSubbox(String label, bool isLast) {
    bool editing = _isEditing[label]!;
    bool isReadOnlyField = label == 'Official Email (Gmail)' || label == 'Contact Number';

    return Container(
      padding: const EdgeInsets.only(bottom: 16),
      margin: EdgeInsets.only(bottom: isLast ? 0 : 16),
      decoration: BoxDecoration(
        border: isLast ? null : Border(bottom: BorderSide(color: borderColor)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // field-header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                label,
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: textMuted,
                ),
              ),
              if (!isReadOnlyField)
                GestureDetector(
                  onTap: () {
                    setState(() {
                      if (editing) {
                        FocusScope.of(context).unfocus();
                      }
                      _isEditing[label] = !editing;
                    });
                  },
                  child: Container(
                    width: 32,
                    height: 32,
                    decoration: BoxDecoration(
                      color: editing ? primaryBlue : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Center(
                      child: FaIcon(
                        editing ? FontAwesomeIcons.check : FontAwesomeIcons.pen,
                        size: 14,
                        color: editing ? Colors.white : const Color(0xFF64748B),
                      ),
                    ),
                  ),
                ),
            ],
          ),
          const SizedBox(height: 8),
          // field-value-subbox
          TextField(
            controller: _controllers[label],
            readOnly: !editing || isReadOnlyField,
            style: GoogleFonts.nunito(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: textDark,
            ),
            decoration: InputDecoration(
              contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
              filled: true,
              fillColor: editing ? Colors.white : const Color(0xFFF8FAFC),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(
                  color: editing ? primaryBlue : Colors.transparent,
                ),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(
                  color: editing ? primaryBlue : Colors.transparent,
                ),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(8),
                borderSide: BorderSide(
                  color: primaryBlue,
                  width: 1.5,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
