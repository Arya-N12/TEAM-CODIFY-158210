import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:fl_chart/fl_chart.dart';
import '../router/app_router.dart';

class Dataset {
  final String kpiTotal;
  final String kpiCompleted;
  final String kpiCompletionRate;
  final String kpiComplianceRate;
  final String kpiAvgTime;
  
  final String totalSub;
  final String completedSub;
  final String completionRateSub;
  final String complianceRateSub;

  final List<String> trendLabels;
  final List<double> trendCompleted;
  final List<double> trendTarget;
  
  final List<double> typeScheduled;
  final List<double> typeSurprise;
  
  final int statusCompleted;
  final int statusPending;
  final int statusInProgress;

  final List<String> districtLabels;
  final List<double> districtScores;

  Dataset({
    required this.kpiTotal, required this.kpiCompleted, required this.kpiCompletionRate, required this.kpiComplianceRate, required this.kpiAvgTime,
    required this.totalSub, required this.completedSub, required this.completionRateSub, required this.complianceRateSub,
    required this.trendLabels, required this.trendCompleted, required this.trendTarget,
    required this.typeScheduled, required this.typeSurprise,
    required this.statusCompleted, required this.statusPending, required this.statusInProgress,
    required this.districtLabels, required this.districtScores,
  });
}

class PerformanceAnalysisScreen extends StatefulWidget {
  const PerformanceAnalysisScreen({super.key});

  @override
  State<PerformanceAnalysisScreen> createState() => _PerformanceAnalysisScreenState();
}

class _PerformanceAnalysisScreenState extends State<PerformanceAnalysisScreen> {
  static const Color primaryBlue = Color(0xFF0B3D91); 
  static const Color bgColor = Color(0xFFF3F4F6); 
  static const Color cardBg = Color(0xFFFFFFFF);
  static const Color textDark = Color(0xFF1E293B);
  static const Color textMuted = Color(0xFF64748B);
  static const Color borderColor = Color(0xFFE2E8F0);
  static const Color successGreen = Color(0xFF138808); // matched HTML #138808
  static const Color warningOrange = Color(0xFFD97706);
  static const Color dangerRed = Color(0xFFEF4444);
  static const Color neutralBlue = Color(0xFF1565C0);

  String _timeframe = 'q3_2026';

  final Map<String, Dataset> _datasets = {
    'q3_2026': Dataset(
      kpiTotal: '142', kpiCompleted: '118', kpiCompletionRate: '83.1%', kpiComplianceRate: '89.4%', kpiAvgTime: '42 mins',
      totalSub: '+12% vs last period', completedSub: '92% on schedule', completionRateSub: '+3.4% improvement', complianceRateSub: 'Based on audit criteria',
      trendLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      trendCompleted: [4, 6, 5, 8, 6, 4], trendTarget: [6, 6, 6, 6, 6, 6],
      typeScheduled: [12, 8, 6, 5], typeSurprise: [4, 3, 2, 4],
      statusCompleted: 32, statusPending: 6, statusInProgress: 2,
      districtLabels: ['Pune', 'Hadapsar', 'Kothrud', 'Pimpri', 'Satara'], districtScores: [91.2, 88.5, 85.0, 79.4, 82.1],
    ),
    'last30': Dataset(
      kpiTotal: '48', kpiCompleted: '42', kpiCompletionRate: '87.5%', kpiComplianceRate: '91.0%', kpiAvgTime: '38 mins',
      totalSub: '+8% vs prev 30 days', completedSub: '95% on schedule', completionRateSub: '+1.2% improvement', complianceRateSub: 'High quality audits',
      trendLabels: ['Day 1-5', 'Day 6-10', 'Day 11-15', 'Day 16-20', 'Day 21-25', 'Day 26-30'],
      trendCompleted: [3, 4, 2, 3, 2, 1], trendTarget: [3, 3, 3, 3, 3, 3],
      typeScheduled: [6, 3, 2, 2], typeSurprise: [2, 1, 1, 1],
      statusCompleted: 12, statusPending: 2, statusInProgress: 1,
      districtLabels: ['Pune', 'Hadapsar', 'Kothrud', 'Pimpri', 'Satara'], districtScores: [93.0, 90.1, 87.4, 82.0, 85.5],
    ),
    'ytd': Dataset(
      kpiTotal: '410', kpiCompleted: '345', kpiCompletionRate: '84.1%', kpiComplianceRate: '86.8%', kpiAvgTime: '45 mins',
      totalSub: 'Annual target 500', completedSub: 'On track for Q4', completionRateSub: 'Steady progress', complianceRateSub: 'Audit benchmark',
      trendLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      trendCompleted: [15, 18, 20, 16, 18, 19], trendTarget: [17, 17, 17, 17, 17, 17],
      typeScheduled: [40, 28, 20, 16], typeSurprise: [12, 8, 6, 5],
      statusCompleted: 104, statusPending: 15, statusInProgress: 6,
      districtLabels: ['Pune', 'Hadapsar', 'Kothrud', 'Pimpri', 'Satara'], districtScores: [85.5, 82.1, 79.4, 88.5, 91.2], // Example data for ytd districts
    ),
  };

  @override
  Widget build(BuildContext context) {
    Dataset data = _datasets[_timeframe]!;

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
          'Performance & Analytics',
          style: GoogleFonts.nunito(
            fontSize: 20,
            fontWeight: FontWeight.w800,
            color: textDark,
          ),
        ),
        centerTitle: false,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh, color: textDark, size: 22),
            onPressed: () => setState(() {}),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header Section & Timeframe Filter
            _buildPageIntro(),
            const SizedBox(height: 24),

            // Compact KPI Grid
            _buildKPIGrid(data),
            const SizedBox(height: 24),

            // Chart 1: Inspections Trend
            _buildChartCard(
              title: 'Inspections Trend',
              badge: _timeframe == 'last30' ? 'Daily' : (_timeframe == 'ytd' ? 'Monthly' : 'Weekly'),
              subtitle: 'Volume of inspections completed over selected period',
              chart: _buildLineChart(data),
              height: 240,
            ),
            const SizedBox(height: 20),

            // Chart 2: Scheduled vs Surprise Breakdown
            _buildChartCard(
              title: 'Scheduled vs. Surprise',
              badge: 'Type Ratio',
              subtitle: 'Comparison of planned audits vs unannounced visits',
              chart: _buildBarChart(data),
              height: 240,
            ),
            const SizedBox(height: 20),
            
            // Chart 3: Status Distribution
            _buildChartCard(
              title: 'Status Distribution',
              subtitle: 'Current operational state of assigned inspections',
              chart: _buildStatusDistribution(data),
              height: 200,
            ),
            const SizedBox(height: 20),

            // Chart 4: District Compliance Comparison
            _buildChartCard(
              title: 'District Compliance Index',
              subtitle: 'Average compliance scores across target districts',
              chart: _buildDistrictChart(data),
              height: 240,
            ),
            const SizedBox(height: 24),

            // Summary Section
            _buildExecutiveSummary(data),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildPageIntro() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Operational Insights', style: GoogleFonts.nunito(fontSize: 24, fontWeight: FontWeight.w800, color: primaryBlue)),
              const SizedBox(height: 4),
              Text('Track and analyze regional inspection metrics.', style: GoogleFonts.nunito(fontSize: 14, fontWeight: FontWeight.w500, color: textMuted)),
            ],
          ),
        ),
        Container(
          height: 38,
          padding: const EdgeInsets.symmetric(horizontal: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(8),
            border: Border.all(color: borderColor),
          ),
          child: DropdownButtonHideUnderline(
            child: DropdownButton<String>(
              value: _timeframe,
              icon: const Icon(Icons.keyboard_arrow_down, color: textMuted),
              style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark),
              onChanged: (String? newValue) {
                if (newValue != null) {
                  setState(() => _timeframe = newValue);
                }
              },
              items: const [
                DropdownMenuItem(value: 'q3_2026', child: Text('Q3 2026 Settlement')),
                DropdownMenuItem(value: 'last30', child: Text('Last 30 Days')),
                DropdownMenuItem(value: 'ytd', child: Text('Year to Date')),
              ],
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildKPIGrid(Dataset data) {
    return Column(
      children: [
        Row(
          children: [
            Expanded(child: _buildKPIBox('Total Inspections', data.kpiTotal, Icons.assignment, data.totalSub)),
            const SizedBox(width: 12),
            Expanded(child: _buildKPIBox('Completed', data.kpiCompleted, Icons.check_circle_outline, data.completedSub)),
          ],
        ),
        const SizedBox(height: 12),
        Row(
          children: [
            Expanded(child: _buildKPIBox('Completion Rate', data.kpiCompletionRate, Icons.pie_chart_outline, data.completionRateSub, isHighlight: true)),
            const SizedBox(width: 12),
            Expanded(child: _buildKPIBox('Avg Compliance', data.kpiComplianceRate, Icons.star_border, data.complianceRateSub, isHighlight: true)),
          ],
        ),
      ],
    );
  }

  Widget _buildKPIBox(String label, String val, IconData icon, String subtitle, {bool isHighlight = false}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
        boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 4, offset: Offset(0, 2))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(icon, size: 16, color: isHighlight ? successGreen : textMuted),
              const SizedBox(width: 8),
              Expanded(child: Text(label, style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w700, color: textMuted), overflow: TextOverflow.ellipsis)),
            ],
          ),
          const SizedBox(height: 12),
          Text(val, style: GoogleFonts.nunito(fontSize: 24, fontWeight: FontWeight.w800, color: textDark)),
          const SizedBox(height: 4),
          Text(subtitle, style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w600, color: isHighlight ? successGreen : textMuted)),
        ],
      ),
    );
  }

  Widget _buildChartCard({required String title, String? badge, required String subtitle, required Widget chart, required double height}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
        boxShadow: const [BoxShadow(color: Color(0x0A000000), blurRadius: 6, offset: Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(title, style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.w800, color: textDark)),
              if (badge != null)
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                  decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(12)),
                  child: Text(badge, style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w700, color: textMuted)),
                ),
            ],
          ),
          const SizedBox(height: 4),
          Text(subtitle, style: GoogleFonts.nunito(fontSize: 12, color: textMuted)),
          const SizedBox(height: 24),
          SizedBox(
            height: height,
            child: chart,
          ),
        ],
      ),
    );
  }

  Widget _buildLineChart(Dataset data) {
    return LineChart(
      LineChartData(
        minY: 0,
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          horizontalInterval: 2,
          getDrawingHorizontalLine: (value) => FlLine(color: const Color(0xFFF1F5F9), strokeWidth: 1),
        ),
        titlesData: FlTitlesData(
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30,
              getTitlesWidget: (val, meta) => Text(val.toInt().toString(), style: GoogleFonts.nunito(fontSize: 10, color: textMuted)),
            ),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (val, meta) {
                if (val.toInt() >= 0 && val.toInt() < data.trendLabels.length) {
                  return Padding(
                    padding: const EdgeInsets.only(top: 8),
                    child: Text(data.trendLabels[val.toInt()], style: GoogleFonts.nunito(fontSize: 10, color: textMuted)),
                  );
                }
                return const Text('');
              },
            ),
          ),
        ),
        borderData: FlBorderData(show: false),
        lineBarsData: [
          LineChartBarData(
            spots: data.trendCompleted.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value)).toList(),
            isCurved: true,
            color: primaryBlue,
            barWidth: 3,
            isStrokeCapRound: true,
            dotData: FlDotData(show: true, getDotPainter: (s, p, b, i) => FlDotCirclePainter(radius: 4, color: primaryBlue, strokeWidth: 2, strokeColor: Colors.white)),
          ),
          LineChartBarData(
            spots: data.trendTarget.asMap().entries.map((e) => FlSpot(e.key.toDouble(), e.value)).toList(),
            isCurved: false,
            color: const Color(0xFF94A3B8),
            barWidth: 2,
            dashArray: [5, 5],
            dotData: const FlDotData(show: false),
          ),
        ],
      ),
    );
  }

  Widget _buildBarChart(Dataset data) {
    return BarChart(
      BarChartData(
        alignment: BarChartAlignment.spaceAround,
        maxY: 45, // scale
        barTouchData: BarTouchData(enabled: false),
        titlesData: FlTitlesData(
          show: true,
          topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
          leftTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              reservedSize: 30,
              getTitlesWidget: (val, meta) => Text(val.toInt().toString(), style: GoogleFonts.nunito(fontSize: 10, color: textMuted)),
            ),
          ),
          bottomTitles: AxisTitles(
            sideTitles: SideTitles(
              showTitles: true,
              getTitlesWidget: (double value, TitleMeta meta) {
                List<String> labels = ['NGOs', 'Homes', 'Hostels', 'Centres'];
                return Padding(
                  padding: const EdgeInsets.only(top: 8),
                  child: Text(labels[value.toInt()], style: GoogleFonts.nunito(fontSize: 10, color: textMuted)),
                );
              },
            ),
          ),
        ),
        gridData: FlGridData(
          show: true,
          drawVerticalLine: false,
          getDrawingHorizontalLine: (val) => FlLine(color: const Color(0xFFF1F5F9), strokeWidth: 1),
        ),
        borderData: FlBorderData(show: false),
        barGroups: List.generate(4, (i) {
          return BarChartGroupData(
            x: i,
            barsSpace: 4,
            barRods: [
              BarChartRodData(toY: data.typeScheduled[i], color: primaryBlue, width: 14, borderRadius: BorderRadius.circular(4)),
              BarChartRodData(toY: data.typeSurprise[i], color: warningOrange, width: 14, borderRadius: BorderRadius.circular(4)),
            ],
          );
        }),
      ),
    );
  }

  Widget _buildStatusDistribution(Dataset data) {
    int total = data.statusCompleted + data.statusPending + data.statusInProgress;
    
    return Row(
      children: [
        SizedBox(
          height: 140,
          width: 140,
          child: Stack(
            children: [
              PieChart(
                PieChartData(
                  sectionsSpace: 2,
                  centerSpaceRadius: 45,
                  startDegreeOffset: -90,
                  sections: [
                    PieChartSectionData(color: successGreen, value: data.statusCompleted.toDouble(), radius: 15, showTitle: false),
                    PieChartSectionData(color: warningOrange, value: data.statusPending.toDouble(), radius: 15, showTitle: false),
                    PieChartSectionData(color: neutralBlue, value: data.statusInProgress.toDouble(), radius: 15, showTitle: false),
                  ],
                ),
              ),
              Center(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Text(total.toString(), style: GoogleFonts.nunito(fontSize: 20, fontWeight: FontWeight.w800, color: textDark)),
                    Text('Total', style: GoogleFonts.nunito(fontSize: 10, fontWeight: FontWeight.w600, color: textMuted)),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(width: 24),
        Expanded(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              _buildLegendItem('Completed', data.statusCompleted, successGreen, total),
              const SizedBox(height: 12),
              _buildLegendItem('Pending', data.statusPending, warningOrange, total),
              const SizedBox(height: 12),
              _buildLegendItem('In Progress', data.statusInProgress, neutralBlue, total),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildLegendItem(String label, int val, Color color, int total) {
    double pct = (val / total) * 100;
    return Row(
      children: [
        Container(width: 12, height: 12, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(3))),
        const SizedBox(width: 8),
        Expanded(child: Text(label, style: GoogleFonts.nunito(fontSize: 13, color: textMuted))),
        Text('$val (${pct.toStringAsFixed(1)}%)', style: GoogleFonts.nunito(fontSize: 13, fontWeight: FontWeight.w700, color: textDark)),
      ],
    );
  }

  Widget _buildDistrictChart(Dataset data) {
    return Column(
      children: List.generate(data.districtLabels.length, (i) {
        double score = data.districtScores[i];
        Color c = score >= 88 ? successGreen : (score >= 82 ? neutralBlue : warningOrange);
        return Padding(
          padding: const EdgeInsets.symmetric(vertical: 8.0),
          child: Row(
            children: [
              SizedBox(
                width: 70, // Fixed width for labels
                child: Text(
                  data.districtLabels[i],
                  style: GoogleFonts.nunito(fontSize: 12, fontWeight: FontWeight.w700, color: textDark),
                  textAlign: TextAlign.right,
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: LayoutBuilder(
                  builder: (context, constraints) {
                    return Stack(
                      children: [
                        Container(
                          height: 14,
                          decoration: BoxDecoration(color: const Color(0xFFF1F5F9), borderRadius: BorderRadius.circular(4)),
                        ),
                        Container(
                          height: 14,
                          width: constraints.maxWidth * (score / 100),
                          decoration: BoxDecoration(color: c, borderRadius: BorderRadius.circular(4)),
                        ),
                      ],
                    );
                  },
                ),
              ),
              const SizedBox(width: 8),
              SizedBox(
                width: 32,
                child: Text(
                  '${score.toInt()}%',
                  style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w800, color: textDark),
                ),
              ),
            ],
          ),
        );
      }),
    );
  }

  Widget _buildExecutiveSummary(Dataset data) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.insights, size: 18, color: primaryBlue),
              const SizedBox(width: 8),
              Text('Executive Summary', style: GoogleFonts.nunito(fontSize: 15, fontWeight: FontWeight.w800, color: textDark)),
            ],
          ),
          const SizedBox(height: 12),
          _richBullet('Overall Completion:', ' ${data.kpiCompletionRate} of scheduled inspections have been completed on time.'),
          const SizedBox(height: 6),
          _richBullet('Risk Alert:', ' Two districts are tracking below 80% compliance; immediate field review recommended.'),
          const SizedBox(height: 6),
          _richBullet('Efficiency:', ' Average inspection resolution time improved to ${data.kpiAvgTime}.'),
        ],
      ),
    );
  }

  Widget _richBullet(String boldText, String normalText) {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text('• ', style: TextStyle(color: textDark, fontSize: 16)),
        Expanded(
          child: RichText(
            text: TextSpan(
              style: GoogleFonts.nunito(fontSize: 13, color: textDark),
              children: [
                TextSpan(text: boldText, style: const TextStyle(fontWeight: FontWeight.w800)),
                TextSpan(text: normalText),
              ],
            ),
          ),
        ),
      ],
    );
  }
}
