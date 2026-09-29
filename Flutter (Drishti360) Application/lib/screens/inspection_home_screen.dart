import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:go_router/go_router.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../theme/app_theme.dart';
import '../router/app_router.dart';

class InspectionHomeScreen extends StatelessWidget {
  const InspectionHomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.bgColor,
      appBar: AppBar(
        backgroundColor: AppColors.primaryBlue,
        elevation: 2,
        shadowColor: AppColors.primaryBlue.withValues(alpha: 0.2),
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
        title: Text(
          'Inspection',
          style: GoogleFonts.nunito(
            fontSize: 19,
            fontWeight: FontWeight.w700,
            color: Colors.white,
            letterSpacing: 0.3,
          ),
        ),
        centerTitle: false,
        actions: const [
          // The CSS pushes the title to the right, which could be simulated with a Spacer in a custom row,
          // or we just use normal AppBar behavior. In standard Android/iOS, title is start or center.
          // Since HTML had space-between with back button on left, title on right...
          // We will put the title on the right if needed, but standard AppBar with centerTitle: false 
          // usually puts it next to the back button. Let's force it to the right to match HTML perfectly.
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              _buildReportCard(context),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReportCard(BuildContext context) {
    return InkWell(
      onTap: () {
        context.push(AppRoutes.report);
      },
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(18),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.borderColor),
          boxShadow: [
            BoxShadow(
              color: const Color(0xFF172033).withValues(alpha: 0.06),
              blurRadius: 18,
              offset: const Offset(0, 4),
            ),
          ],
        ),
        child: Row(
          children: [
            // Icon box
            Container(
              width: 46,
              height: 46,
              decoration: BoxDecoration(
                color: AppColors.accentLightBlue,
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Center(
                child: FaIcon(
                  FontAwesomeIcons.fileLines,
                  color: AppColors.primaryBlue,
                  size: 22,
                ),
              ),
            ),
            const SizedBox(width: 14),
            // Text details
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Annual Compliance Report',
                    style: GoogleFonts.nunito(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: AppColors.textDark,
                      height: 1.2,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'ABCD Welfare Institute',
                    style: GoogleFonts.nunito(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: AppColors.textMuted,
                    ),
                  ),
                ],
              ),
            ),
            // Arrow
            const Icon(
              Icons.arrow_forward_ios_rounded,
              color: Color(0xFF94A3B8),
              size: 16,
            ),
          ],
        ),
      ),
    );
  }
}
