import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../theme/app_theme.dart';
import '../router/app_router.dart';
import 'home_screen.dart';
import 'package:flutter/services.dart';
import 'vault_gallery_view.dart';

class GeoTagScreen extends ConsumerStatefulWidget {
  const GeoTagScreen({super.key});

  @override
  ConsumerState<GeoTagScreen> createState() => _GeoTagScreenState();
}

class _GeoTagScreenState extends ConsumerState<GeoTagScreen> with SingleTickerProviderStateMixin {
  static const channel = MethodChannel('com.inspex.inspec1dart/geotag');
  late AnimationController _pulseController;
  late Animation<double> _pulseAnimation;

  void _showPasswordDialog(BuildContext context) {
    final TextEditingController controller = TextEditingController();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          backgroundColor: Colors.white,
          title: Text(
            'Authentication Required',
            style: GoogleFonts.nunito(
              fontWeight: FontWeight.bold,
              color: Colors.black87,
            ),
          ),
          content: TextField(
            controller: controller,
            obscureText: true,
            decoration: const InputDecoration(
              hintText: 'Enter Password',
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            TextButton(
              onPressed: () {
                if (controller.text == '1234') {
                  Navigator.pop(context);
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => const VaultGalleryView(),
                    ),
                  );
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Incorrect Password')),
                  );
                }
              },
              child: const Text('Unlock'),
            ),
          ],
        );
      },
    );
  }

  @override
  void initState() {
    super.initState();
    _pulseController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    )..repeat(reverse: true);
    
    _pulseAnimation = Tween<double>(begin: 0.0, end: 1.0).animate(
      CurvedAnimation(parent: _pulseController, curve: Curves.easeInOut),
    );
  }

  @override
  void dispose() {
    _pulseController.dispose();
    super.dispose();
  }

  void _showToast(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(
          message,
          style: GoogleFonts.nunito(
            fontSize: 13,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
          textAlign: TextAlign.center,
        ),
        backgroundColor: AppColors.textDark,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
        margin: const EdgeInsets.only(bottom: 24, left: 24, right: 24),
        duration: const Duration(milliseconds: 2800),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    const Color primaryDeepBlue = Color(0xFF0B3D91);
    const Color pageBg = Color(0xFFF5F7FA);
    const Color successTeal = Color(0xFF0D9488);
    const Color successTealLight = Color(0xFFCCFBF1);
    const Color secureBlue = Color(0xFF0284C7);
    const Color secureBlueLight = Color(0xFFE0F2FE);

    return Scaffold(
      backgroundColor: pageBg,
      bottomNavigationBar: const AppBottomNav(),
      appBar: AppBar(
        backgroundColor: primaryDeepBlue,
        elevation: 0,
        centerTitle: true,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: Colors.white, size: 24),
          onPressed: () {
            if (context.canPop()) {
              context.pop();
            } else {
              context.go(AppRoutes.home);
            }
          },
        ),
        title: Text(
          'Vault Gallery',
          style: GoogleFonts.nunito(
            fontSize: 19,
            fontWeight: FontWeight.w700,
            color: Colors.white,
            letterSpacing: 0.3,
          ),
        ),
      ),
      body: Column(
        children: [
          // System Status Banner
          Container(
            color: const Color(0xFFE2E8F0),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
            child: Row(
              children: [
                AnimatedBuilder(
                  animation: _pulseAnimation,
                  builder: (context, child) {
                    return Container(
                      width: 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: successTeal,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: successTeal.withValues(alpha: 0.7 * (1 - _pulseAnimation.value)),
                            spreadRadius: 6 * _pulseAnimation.value,
                            blurRadius: 0,
                          ),
                        ],
                      ),
                    );
                  },
                ),
                const SizedBox(width: 8),
                Text(
                  'GPS READY • ENCRYPTED',
                  style: GoogleFonts.nunito(
                    fontSize: 11,
                    fontWeight: FontWeight.w800,
                    color: successTeal,
                    letterSpacing: 1,
                  ),
                ),
              ],
            ),
          ),
          
          // Main Content
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(16),
              child: Column(
                children: [
                  const SizedBox(height: 8),
                  // Camera Card
                  _VaultCard(
                    title: 'Camera',
                    description: 'Capture with embedded GPS & timestamp meta...',
                    icon: FontAwesomeIcons.camera,
                    iconBgColor: successTealLight,
                    iconColor: successTeal,
                    badgeIcon: FontAwesomeIcons.satelliteDish,
                    badgeText: 'HIGH ACCURACY GPS',
                    badgeBgColor: successTealLight,
                    badgeColor: successTeal,
                    badgeBorderColor: successTeal.withValues(alpha: 0.2),
                    onTap: () async {
                      _showToast('Initializing Geo-Tagged Camera...');
                      try {
                        final String? imagePath = await channel.invokeMethod('launchCamera');
                        if (imagePath != null && context.mounted) {
                          _showToast('Image saved: $imagePath');
                        }
                      } on PlatformException catch (e) {
                        if (context.mounted && e.code != 'CANCELLED') {
                          _showToast('Error: ${e.message}');
                        }
                      }
                    },
                  ),
                  
                  const SizedBox(height: 20),
                  
                  // Image Vault Card
                  _VaultCard(
                    title: 'Image Vault',
                    description: 'Encrypted offline library of geotagged captures',
                    icon: FontAwesomeIcons.lock,
                    iconBgColor: secureBlueLight,
                    iconColor: secureBlue,
                    badgeIcon: FontAwesomeIcons.shieldHalved, // closest to shield-alt
                    badgeText: 'AES-256 SECURED',
                    badgeBgColor: secureBlueLight,
                    badgeColor: secureBlue,
                    badgeBorderColor: secureBlue.withValues(alpha: 0.2),
                    onTap: () {
                      _showPasswordDialog(context);
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _VaultCard extends StatefulWidget {
  final String title;
  final String description;
  final FaIconData icon;
  final Color iconBgColor;
  final Color iconColor;
  final FaIconData badgeIcon;
  final String badgeText;
  final Color badgeBgColor;
  final Color badgeColor;
  final Color badgeBorderColor;
  final VoidCallback onTap;

  const _VaultCard({
    required this.title,
    required this.description,
    required this.icon,
    required this.iconBgColor,
    required this.iconColor,
    required this.badgeIcon,
    required this.badgeText,
    required this.badgeBgColor,
    required this.badgeColor,
    required this.badgeBorderColor,
    required this.onTap,
  });

  @override
  State<_VaultCard> createState() => _VaultCardState();
}

class _VaultCardState extends State<_VaultCard> {
  bool _isPressed = false;

  @override
  Widget build(BuildContext context) {
    const Color lightBlue = Color(0xFFEAF4FF);
    const Color primaryDeepBlue = Color(0xFF0B3D91);
    const Color borderColor = Color(0xFFD9DEE7);
    const Color cardBg = Colors.white;

    return GestureDetector(
      onTapDown: (_) => setState(() => _isPressed = true),
      onTapUp: (_) {
        setState(() => _isPressed = false);
        widget.onTap();
      },
      onTapCancel: () => setState(() => _isPressed = false),
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 150),
        transform: Matrix4.diagonal3Values(
          _isPressed ? 0.98 : 1.0,
          _isPressed ? 0.98 : 1.0,
          1.0,
        ),
        transformAlignment: Alignment.center,
        padding: const EdgeInsets.all(20),
        decoration: BoxDecoration(
          color: cardBg,
          borderRadius: BorderRadius.circular(20),
          border: Border.all(
            color: _isPressed ? primaryDeepBlue : borderColor,
            width: 1,
          ),
          boxShadow: const [
            BoxShadow(
              color: Color(0x140B3D91), // rgba(11, 61, 145, 0.08)
              blurRadius: 20,
              offset: Offset(0, 6),
            ),
          ],
        ),
        child: Column(
          children: [
            // Header Row
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 52,
                  height: 52,
                  decoration: BoxDecoration(
                    color: widget.iconBgColor,
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Center(
                    child: FaIcon(
                      widget.icon,
                      color: widget.iconColor,
                      size: 22,
                    ),
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                  decoration: BoxDecoration(
                    color: widget.badgeBgColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: widget.badgeBorderColor),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      FaIcon(
                        widget.badgeIcon,
                        size: 10,
                        color: widget.badgeColor,
                      ),
                      const SizedBox(width: 6),
                      Text(
                        widget.badgeText,
                        style: GoogleFonts.nunito(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: widget.badgeColor,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 20),
            // Content Row
            Row(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        widget.title,
                        style: GoogleFonts.nunito(
                          fontSize: 22,
                          fontWeight: FontWeight.w800,
                          color: const Color(0xFF172033),
                          height: 1.1,
                        ),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        widget.description,
                        style: GoogleFonts.nunito(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: const Color(0xFF5F6B7A),
                          height: 1.4,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 16),
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: _isPressed ? primaryDeepBlue : lightBlue,
                    shape: BoxShape.circle,
                  ),
                  child: Center(
                    child: FaIcon(
                      FontAwesomeIcons.arrowRight,
                      size: 18,
                      color: _isPressed ? Colors.white : primaryDeepBlue,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
