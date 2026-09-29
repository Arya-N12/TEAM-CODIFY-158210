import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import '../router/app_router.dart';

class NotificationItem {
  final String sender;
  final String time;
  final String msg;
  final FaIconData icon;
  final Color iconColor;

  NotificationItem({
    required this.sender,
    required this.time,
    required this.msg,
    required this.icon,
    required this.iconColor,
  });
}

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  static const Color primaryBlue = Color(0xFF09377A);
  static const Color bgColor = Color(0xFFF4F7FB);
  static const Color textDark = Color(0xFF0F172A);
  static const Color textMuted = Color(0xFF64748B);
  static const Color borderColor = Color(0xFFE2E8F0);

  final List<NotificationItem> _notifications = [
    NotificationItem(
      sender: 'DoSJE',
      time: '10 min ago',
      msg: 'Urgent: The scheduled inspection for ABC Welfare Foundation has been preponed. Please review the updated timeline immediately. Ensure all necessary documents are prepared for the early visit and contact the site coordinator if there are any issues.',
      icon: FontAwesomeIcons.landmark,
      iconColor: Colors.blue,
    ),
    NotificationItem(
      sender: 'District Magistrate',
      time: '2 hours ago',
      msg: 'Your Draft Report for INS-20260918-045 has been flagged. Please upload the missing geo-tagged evidence. Failure to do so within 24 hours will result in the report being marked as incomplete and returned for a full review cycle.',
      icon: FontAwesomeIcons.shieldHalved,
      iconColor: Colors.orange,
    ),
    NotificationItem(
      sender: 'MoSJE',
      time: '1 day ago',
      msg: 'New Standard Operating Procedures (SOPs) for the Q4 inspections have been published. Kindly acknowledge receipt.',
      icon: FontAwesomeIcons.fileContract,
      iconColor: Colors.green,
    ),
  ];

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
        title: Text(
          'Notifications',
          style: GoogleFonts.nunito(
            fontSize: 19,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
        ),
        centerTitle: false,
      ),
      body: ListView.separated(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 20),
        itemCount: _notifications.length,
        separatorBuilder: (context, index) => const SizedBox(height: 16),
        itemBuilder: (context, index) {
          final notif = _notifications[index];
          return Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: borderColor),
              boxShadow: [
                BoxShadow(
                  color: textDark.withValues(alpha: 0.04),
                  blurRadius: 10,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: notif.iconColor.withValues(alpha: 0.1),
                        shape: BoxShape.circle,
                      ),
                      child: FaIcon(notif.icon, color: notif.iconColor, size: 16),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            notif.sender,
                            style: GoogleFonts.nunito(
                              fontSize: 14,
                              fontWeight: FontWeight.w800,
                              color: textDark,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            notif.time,
                            style: GoogleFonts.nunito(
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                              color: textMuted,
                            ),
                          ),
                        ],
                      ),
                    ),
                    IconButton(
                      icon: const FaIcon(FontAwesomeIcons.trashCan, size: 16, color: textMuted),
                      onPressed: () {
                        setState(() {
                          _notifications.removeAt(index);
                        });
                      },
                      constraints: const BoxConstraints(),
                      padding: EdgeInsets.zero,
                    ),
                  ],
                ),
                const SizedBox(height: 12),
                _ExpandableText(text: notif.msg),
              ],
            ),
          );
        },
      ),
    );
  }
}

class _ExpandableText extends StatefulWidget {
  final String text;
  const _ExpandableText({required this.text});

  @override
  State<_ExpandableText> createState() => _ExpandableTextState();
}

class _ExpandableTextState extends State<_ExpandableText> {
  bool _isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.text,
          maxLines: _isExpanded ? null : 2,
          overflow: _isExpanded ? TextOverflow.visible : TextOverflow.ellipsis,
          style: GoogleFonts.nunito(
            fontSize: 14,
            fontWeight: FontWeight.w500,
            color: const Color(0xFF0F172A),
            height: 1.4,
          ),
        ),
        if (widget.text.length > 80) // Simple threshold to show button
          GestureDetector(
            onTap: () => setState(() => _isExpanded = !_isExpanded),
            child: Padding(
              padding: const EdgeInsets.only(top: 4.0),
              child: Text(
                _isExpanded ? 'Read less' : 'Read more',
                style: GoogleFonts.nunito(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF09377A),
                ),
              ),
            ),
          ),
      ],
    );
  }
}
