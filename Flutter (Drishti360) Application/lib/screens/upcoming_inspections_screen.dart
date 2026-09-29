import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import '../router/app_router.dart';

class UpcomingInspectionRecord {
  final String id;
  final String name;
  final String location;
  final String date;
  final String time;
  final String type;
  final bool isUrgent;
  final String category; // 'today', 'week', 'later'

  UpcomingInspectionRecord({
    required this.id,
    required this.name,
    required this.location,
    required this.date,
    required this.time,
    required this.type,
    required this.isUrgent,
    required this.category,
  });
}

class UpcomingInspectionsScreen extends StatefulWidget {
  const UpcomingInspectionsScreen({super.key});

  @override
  State<UpcomingInspectionsScreen> createState() => _UpcomingInspectionsScreenState();
}

class _UpcomingInspectionsScreenState extends State<UpcomingInspectionsScreen> {
  static const Color primaryBlue = Color(0xFF0B3D91);
  static const Color bgColor = Color(0xFFF3F4F6); // modern gray background
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textMuted = Color(0xFF64748B);
  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color badgeBg = Color(0xFFEFF6FF);
  static const Color badgeText = Color(0xFF3B82F6);
  static const Color urgentBg = Color(0xFFFEF2F2);
  static const Color urgentText = Color(0xFFDC2626);
  static const Color chipActiveBg = Color(0xFF0B3D91);
  static const Color chipInactiveBg = Color(0xFFFFFFFF);

  String _activeFilter = 'all';

  final List<UpcomingInspectionRecord> _allUpcoming = [
    UpcomingInspectionRecord(
      id: 'INSP-2026-001',
      name: 'ABC Welfare Foundation',
      location: 'Pune, Maharashtra',
      date: '20 September 2026',
      time: '10:30 AM',
      type: 'Scheduled Inspection',
      isUrgent: false,
      category: 'week',
    ),
    UpcomingInspectionRecord(
      id: 'INSP-2026-002',
      name: 'XYZ Rehabilitation Centre',
      location: 'Pimpri-Chinchwad, MH',
      date: '18 September 2026',
      time: '02:00 PM',
      type: 'Surprise Inspection',
      isUrgent: true,
      category: 'today',
    ),
    UpcomingInspectionRecord(
      id: 'INSP-2026-003',
      name: 'Sunrise Care Institute',
      location: 'Pune, Maharashtra',
      date: '22 September 2026',
      time: '11:00 AM',
      type: 'Scheduled Inspection',
      isUrgent: false,
      category: 'week',
    ),
    UpcomingInspectionRecord(
      id: 'INSP-2026-005',
      name: 'Sahyog Welfare Centre',
      location: 'Kothrud, Pune',
      date: '30 September 2026',
      time: '01:30 PM',
      type: 'Follow-up Inspection',
      isUrgent: false,
      category: 'later',
    ),
  ];

  @override
  Widget build(BuildContext context) {
    var filtered = _allUpcoming.where((item) {
      if (_activeFilter == 'all') return true;
      if (_activeFilter == 'today' && item.category == 'today') return true;
      if (_activeFilter == 'this-week' && item.category == 'week') return true;
      if (_activeFilter == 'later' && item.category == 'later') return true;
      return false;
    }).toList();

    int totalUpcoming = _allUpcoming.length;
    int thisWeek = _allUpcoming.where((i) => i.category == 'week' || i.category == 'today').length;

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
          'Upcoming Inspections',
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
                  Text(
                    'Assigned Schedule',
                    style: GoogleFonts.nunito(
                      fontSize: 24,
                      fontWeight: FontWeight.w800,
                      color: primaryBlue,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    'View and manage your upcoming inspection assignments.',
                    style: GoogleFonts.nunito(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                      color: textMuted,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // SUMMARY SECTION
                  Row(
                    children: [
                      Expanded(child: _buildSummaryCard(totalUpcoming.toString(), 'Total Upcoming')),
                      const SizedBox(width: 12),
                      Expanded(child: _buildSummaryCard(thisWeek.toString(), 'This Week')),
                    ],
                  ),
                  const SizedBox(height: 24),

                  // FILTER CONTROLS
                  SingleChildScrollView(
                    scrollDirection: Axis.horizontal,
                    child: Row(
                      children: [
                        _buildFilterChip('All', 'all'),
                        _buildFilterChip('Today', 'today'),
                        _buildFilterChip('This Week', 'this-week'),
                        _buildFilterChip('Later', 'later'),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),

                  // LIST SECTION HEADER
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'UPCOMING ASSIGNMENTS',
                        style: GoogleFonts.nunito(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: textMuted,
                          letterSpacing: 1.2,
                        ),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: badgeBg,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          '${filtered.length} Assignments',
                          style: GoogleFonts.nunito(
                            fontSize: 11,
                            fontWeight: FontWeight.w700,
                            color: badgeText,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
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
                    const Icon(Icons.fact_check_outlined, size: 48, color: textMuted),
                    const SizedBox(height: 16),
                    Text(
                      'No Upcoming Inspections',
                      style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w700, color: textDark),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'You currently have no inspection assignments matching the selected filter criteria.',
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
                      onPressed: () => setState(() => _activeFilter = 'all'),
                      child: Text('View All Inspections', style: GoogleFonts.nunito(fontWeight: FontWeight.w700)),
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
                  (context, index) => _buildInspectionCard(filtered[index]),
                  childCount: filtered.length,
                ),
              ),
            ),
            
          const SliverPadding(padding: EdgeInsets.only(bottom: 30)),
        ],
      ),
    );
  }

  Widget _buildSummaryCard(String value, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
        boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: GoogleFonts.nunito(
              fontSize: 32,
              fontWeight: FontWeight.w800,
              color: primaryBlue,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: GoogleFonts.nunito(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: textMuted,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, String value) {
    bool isActive = _activeFilter == value;
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: GestureDetector(
        onTap: () => setState(() => _activeFilter = value),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: isActive ? chipActiveBg : chipInactiveBg,
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: isActive ? chipActiveBg : borderColor),
            boxShadow: isActive ? const [BoxShadow(color: Color(0x260B3D91), blurRadius: 4, offset: Offset(0, 2))] : null,
          ),
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
    );
  }

  Widget _buildInspectionCard(UpcomingInspectionRecord record) {
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
                    color: record.isUrgent ? urgentBg : badgeBg,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    record.type,
                    style: GoogleFonts.nunito(
                      fontSize: 10,
                      fontWeight: FontWeight.w700,
                      color: record.isUrgent ? urgentText : badgeText,
                    ),
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
                  record.name,
                  style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w800, color: textDark),
                ),
                const SizedBox(height: 4),
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
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: bgColor,
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.calendar_today, size: 16, color: primaryBlue),
                      const SizedBox(width: 8),
                      Text(
                        record.date,
                        style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark),
                      ),
                      const Spacer(),
                      const Icon(Icons.access_time, size: 16, color: primaryBlue),
                      const SizedBox(width: 8),
                      Text(
                        record.time,
                        style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark),
                      ),
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
