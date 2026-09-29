import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

// ─────────────────────────────────────────────────────────────────────────────
// AppColors — translated from CSS :root variables in style.css
// ─────────────────────────────────────────────────────────────────────────────
class AppColors {
  AppColors._();

  // Primary
  static const Color primaryBlue  = Color(0xFF09377A);
  static const Color primaryHover = Color(0xFF072A5E);

  // Backgrounds
  static const Color bgColor = Color(0xFFF8FAFC);
  static const Color cardBg  = Color(0xFFFFFFFF);

  // Text
  static const Color textDark  = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);

  // Borders
  static const Color borderColor = Color(0xFFE2E8F0);

  // Danger / Red
  static const Color dangerRed      = Color(0xFFDC2626);
  static const Color dangerBg       = Color(0xFFFEF2F2);
  static const Color rejectionRed   = Color(0xFFC62828);
  static const Color lightRejection = Color(0xFFFDECEC);

  // Warning / Orange
  static const Color warningOrange = Color(0xFFEA580C);
  static const Color warningBg     = Color(0xFFFFF7ED);

  // Accent
  static const Color accentLightBlue = Color(0xFFE0F2FE);

  // Disabled
  static const Color disabled   = Color(0xFFB8C1CC);
  static const Color disabledBg = Color(0xFFEAECEF);

  // Overlay
  static const Color overlay = Color(0x8C0A192D); // rgba(10,25,45,0.55)
}

// ─────────────────────────────────────────────────────────────────────────────
// AppTheme — MaterialApp ThemeData
// ─────────────────────────────────────────────────────────────────────────────
class AppTheme {
  AppTheme._();

  static ThemeData get light {
    final base = ThemeData(
      colorScheme: ColorScheme.fromSeed(
        seedColor: AppColors.primaryBlue,
        primary: AppColors.primaryBlue,
        surface: AppColors.bgColor,
      ),
      scaffoldBackgroundColor: AppColors.bgColor,
      useMaterial3: true,
    );

    return base.copyWith(
      textTheme: GoogleFonts.nunitoTextTheme(base.textTheme).copyWith(
        headlineLarge: GoogleFonts.nunito(fontSize: 22, fontWeight: FontWeight.w700, color: AppColors.textDark),
        headlineMedium: GoogleFonts.nunito(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.textDark),
        titleLarge: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.primaryBlue),
        titleMedium: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w700, color: AppColors.textDark),
        bodyMedium: GoogleFonts.nunito(fontSize: 13, color: AppColors.textMuted),
        bodySmall: GoogleFonts.nunito(fontSize: 11, color: AppColors.textMuted),
        labelLarge: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 0.5),
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: AppColors.primaryBlue,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          padding: const EdgeInsets.symmetric(vertical: 14),
          elevation: 0,
          textStyle: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.dangerRed,
          side: const BorderSide(color: AppColors.dangerRed),
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
          padding: const EdgeInsets.symmetric(vertical: 14),
          textStyle: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w600),
        ),
      ),
      cardTheme: CardThemeData(
        color: AppColors.cardBg,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        margin: EdgeInsets.zero,
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: Colors.white,
        elevation: 0,
        surfaceTintColor: Colors.transparent,
        iconTheme: const IconThemeData(color: AppColors.textDark),
        titleTextStyle: GoogleFonts.nunito(fontSize: 18, fontWeight: FontWeight.w700, color: AppColors.textDark),
      ),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AppDecorations — reusable BoxDecoration helpers (from style.css classes)
// ─────────────────────────────────────────────────────────────────────────────
class AppDecorations {
  AppDecorations._();

  // .card
  static BoxDecoration get card => BoxDecoration(
    color: AppColors.cardBg,
    borderRadius: BorderRadius.circular(16),
    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.05), blurRadius: 15, offset: const Offset(0, 4))],
  );

  // .card-warning
  static BoxDecoration get cardWarning => BoxDecoration(
    color: AppColors.warningBg,
    borderRadius: BorderRadius.circular(16),
    border: Border.all(color: const Color(0xFFFED7AA)),
  );

  // .quick-actions-wrapper / .resources-grid (navy blue container)
  static BoxDecoration get navyGrid => BoxDecoration(
    color: AppColors.primaryBlue,
    borderRadius: BorderRadius.circular(16),
    boxShadow: [BoxShadow(color: AppColors.primaryBlue.withValues(alpha: 0.15), blurRadius: 20, offset: const Offset(0, 8))],
  );

  // .action-box / .resource-card (white tile inside navy grid)
  static BoxDecoration get gridItem => BoxDecoration(
    color: Colors.white,
    borderRadius: BorderRadius.circular(12),
    boxShadow: [BoxShadow(color: Colors.black.withValues(alpha: 0.1), blurRadius: 10, offset: const Offset(0, 4))],
  );

  // .profile-card gradient
  static BoxDecoration get profileCard => const BoxDecoration(
    gradient: LinearGradient(
      begin: Alignment.topLeft,
      end: Alignment.bottomRight,
      colors: [Color(0xFF09377A), Color(0xFF1A65C9)],
    ),
    borderRadius: BorderRadius.all(Radius.circular(16)),
    boxShadow: [BoxShadow(color: Color(0x4009377A), blurRadius: 20, offset: Offset(0, 8))],
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AppTextStyles — named text style constants for quick reuse
// ─────────────────────────────────────────────────────────────────────────────
class AppTextStyles {
  AppTextStyles._();

  static TextStyle get sectionTitle => GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w700, letterSpacing: 0.5, color: AppColors.primaryBlue);
  static TextStyle get cardTitle    => GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w700, color: AppColors.primaryBlue);
  static TextStyle get bodyMuted    => GoogleFonts.nunito(fontSize: 13, color: AppColors.textMuted);
  static TextStyle get tagBlue      => GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w700, color: AppColors.primaryBlue);
  static TextStyle get tagRed       => GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.dangerRed);
  static TextStyle get tagOrange    => GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w600, color: AppColors.warningOrange);
}
