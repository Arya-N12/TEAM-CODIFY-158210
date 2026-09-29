import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../router/app_router.dart';

class ChecklistItem {
  final int id;
  final String title;
  final String desc;
  bool isCompleted;

  ChecklistItem({
    required this.id,
    required this.title,
    required this.desc,
    this.isCompleted = false,
  });
}

class InspectionChecklistScreen extends StatefulWidget {
  const InspectionChecklistScreen({super.key});

  @override
  State<InspectionChecklistScreen> createState() => _InspectionChecklistScreenState();
}

class _InspectionChecklistScreenState extends State<InspectionChecklistScreen> {
  static const Color primaryBlue = Color(0xFF09377A);
  static const Color bgColor = Color(0xFFF8FAFC);
  static const Color surface = Color(0xFFFFFFFF);
  static const Color textPrimary = Color(0xFF0F172A);
  static const Color textSecondary = Color(0xFF475569);
  static const Color borderColor = Color(0xFFCBD5E1);
  static const Color success = Color(0xFF16A34A);
  
  final List<ChecklistItem> _items = [
    ChecklistItem(id: 1, title: 'Inspection Initiation / Assignment Verification', desc: 'Verify assigned inspection details, department mandate, and official authorization.'),
    ChecklistItem(id: 2, title: 'Location Verification', desc: 'Verify and confirm the physical inspection location via geo-tagging and site markers.'),
    ChecklistItem(id: 3, title: 'Identity / Authority Verification', desc: 'Verify relevant institutional authority, registration, and authorized personnel present.'),
    ChecklistItem(id: 4, title: 'Initial Site Assessment', desc: 'Conduct initial walkthrough and assess general operating and sanitary conditions.'),
    ChecklistItem(id: 5, title: 'Records / Documentation Verification', desc: 'Verify statutory registers, admission logs, financial records, and supporting documents.'),
    ChecklistItem(id: 6, title: 'Staff / Personnel Verification', desc: 'Verify the presence, credentials, and identity of administrative and support staff.'),
    ChecklistItem(id: 7, title: 'Beneficiary / Participant Verification', desc: 'Verify participant attendance, eligibility records, and direct interactions where applicable.'),
    ChecklistItem(id: 8, title: 'Infrastructure / Facility Assessment', desc: 'Assess building safety, dormitory/classroom conditions, kitchen, and physical amenities.'),
    ChecklistItem(id: 9, title: 'Service / Activity Verification', desc: 'Verify that mandated welfare services and daily activities are actively being delivered.'),
    ChecklistItem(id: 10, title: 'Attendance / Operational Verification', desc: 'Cross-check biometric or physical attendance logs against actual operational status.'),
    ChecklistItem(id: 11, title: 'Evidence Capture', desc: 'Capture geo-tagged photographs, document scans, and time-stamped inspection evidence.'),
    ChecklistItem(id: 12, title: 'Query / Follow-up Assessment', desc: 'Address specific concerns, past non-compliance issues, or direct inquiries.'),
    ChecklistItem(id: 13, title: 'Stakeholder Feedback', desc: 'Collect brief verbal feedback or statements from beneficiaries or local staff.'),
    ChecklistItem(id: 14, title: 'Preliminary Report Drafting', desc: 'Compile initial observations, scores, and draft remarks directly into the system.'),
    ChecklistItem(id: 15, title: 'Final Review & Submission', desc: 'Review all captured data, apply digital signature, and submit the final inspection report.')
  ];

  @override
  Widget build(BuildContext context) {
    int completedCount = _items.where((i) => i.isCompleted).length;
    double progress = completedCount / _items.length;

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
              context.go(AppRoutes.home); // default to home since this might be accessed directly
            }
          },
        ),
        title: Text(
          'Inspection Checklist',
          style: GoogleFonts.nunito(
            fontSize: 19,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
        centerTitle: false,
      ),
      body: Column(
        children: [
          // Progress Section
          Container(
            color: primaryBlue,
            padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      'Progress',
                      style: GoogleFonts.nunito(
                        fontSize: 14,
                        fontWeight: FontWeight.w600,
                        color: Colors.white70,
                      ),
                    ),
                    Text(
                      '\%',
                      style: GoogleFonts.nunito(
                        fontSize: 14,
                        fontWeight: FontWeight.w700,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(4),
                  child: LinearProgressIndicator(
                    value: progress,
                    minHeight: 8,
                    backgroundColor: Colors.white24,
                    valueColor: AlwaysStoppedAnimation<Color>(success),
                  ),
                ),
                const SizedBox(height: 12),
                Text(
                  '\ of \ completed',
                  style: GoogleFonts.nunito(
                    fontSize: 12,
                    fontWeight: FontWeight.w500,
                    color: Colors.white70,
                  ),
                ),
              ],
            ),
          ),
          
          // Checklist
          Expanded(
            child: ListView.separated(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
              itemCount: _items.length,
              separatorBuilder: (ctx, i) => const SizedBox(height: 12),
              itemBuilder: (ctx, i) {
                final item = _items[i];
                return GestureDetector(
                  onTap: () {
                    // Navigate to start inspection step (Page 12)
                    context.push(AppRoutes.startInspection);
                  },
                  child: Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: surface,
                      borderRadius: BorderRadius.circular(12),
                      border: Border.all(
                        color: item.isCompleted ? success : borderColor,
                        width: item.isCompleted ? 1.5 : 1.0,
                      ),
                      boxShadow: [
                        BoxShadow(
                          color: textPrimary.withValues(alpha: 0.04),
                          blurRadius: 8,
                          offset: const Offset(0, 2),
                        ),
                      ],
                    ),
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        GestureDetector(
                          onTap: () {
                            setState(() {
                              item.isCompleted = !item.isCompleted;
                            });
                          },
                          child: Container(
                            width: 24,
                            height: 24,
                            margin: const EdgeInsets.only(top: 2),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: item.isCompleted ? success : Colors.transparent,
                              border: Border.all(
                                color: item.isCompleted ? success : borderColor,
                                width: 2,
                              ),
                            ),
                            child: item.isCompleted
                                ? const Icon(Icons.check, size: 16, color: Colors.white)
                                : null,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                item.title,
                                style: GoogleFonts.nunito(
                                  fontSize: 15,
                                  fontWeight: FontWeight.w700,
                                  color: textPrimary,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                item.desc,
                                style: GoogleFonts.nunito(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w500,
                                  color: textSecondary,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(width: 8),
                        const Icon(Icons.chevron_right, color: borderColor),
                      ],
                    ),
                  ),
                );
              },
            ),
          ),
        ],
      ),
    );
  }
}
