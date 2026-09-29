import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;

const Color _primaryBlue = Color(0xFF09377A);
const Color _bgColor = Color(0xFFF8FAFC);
const Color _cardBg = Color(0xFFFFFFFF);
const Color _textDark = Color(0xFF0F172A);
const Color _textMuted = Color(0xFF64748B);
const Color _borderColor = Color(0xFFE2E8F0);
const Color _accentLightBlue = Color(0xFFE0F2FE);

class ChatMessage {
  final String text;
  final bool isUser;
  final String time;

  ChatMessage({required this.text, required this.isUser, required this.time});
}

class ChatScreen extends StatefulWidget {
  const ChatScreen({super.key});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _controller = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  final List<ChatMessage> _messages = [
    ChatMessage(
      text: 'Hello! I am the DoSJE Smart Monitoring Assistant. How can I help you with inspection rules, draft reports, or compliance guidelines today?',
      isUser: false,
      time: 'Just now',
    )
  ];
  
  bool _isLoading = false;

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  Future<void> _sendMessage() async {
    final text = _controller.text.trim();
    if (text.isEmpty) return;

    setState(() {
      _messages.add(ChatMessage(text: text, isUser: true, time: 'Just now'));
      _isLoading = true;
    });
    _controller.clear();
    _scrollToBottom();

    try {
      // Using 10.0.2.2 for Android Emulator, or localhost if running web/windows
      // Using the local network IP so physical devices on the same Wi-Fi can connect
      final uri = Uri.parse('http://172.21.210.85:3000/api/chat'); 
      
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'question': text}),
      ).timeout(const Duration(seconds: 300));

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        setState(() {
          _messages.add(ChatMessage(text: data['answer'] ?? 'No answer provided.', isUser: false, time: 'Just now'));
        });
      } else {
        setState(() {
          _messages.add(ChatMessage(text: 'Error: Cannot connect to RAG service.', isUser: false, time: 'Just now'));
        });
      }
    } catch (e) {
      setState(() {
        _messages.add(ChatMessage(text: 'Error: Could not reach the AI Assistant backend. Please ensure the server is running.', isUser: false, time: 'Just now'));
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
      _scrollToBottom();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _bgColor,
      appBar: AppBar(
        backgroundColor: _bgColor,
        elevation: 0,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: _primaryBlue),
          onPressed: () => Navigator.pop(context),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('DoSJE AI Assistant', style: GoogleFonts.nunito(fontSize: 16, fontWeight: FontWeight.bold, color: _textDark)),
            Text('RAG Document Engine', style: GoogleFonts.nunito(fontSize: 12, color: _textMuted)),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1.0),
          child: Container(color: _borderColor, height: 1.0),
        ),
      ),
      body: Column(
        children: [
          // System Notice
          Container(
            width: double.infinity,
            color: _accentLightBlue,
            padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 16),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.security, size: 12, color: _primaryBlue),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Responses are generated based on official DoSJE guidelines and SOPs.',
                    style: GoogleFonts.nunito(fontSize: 11, fontWeight: FontWeight.w600, color: _primaryBlue),
                    textAlign: TextAlign.center,
                  ),
                ),
              ],
            ),
          ),
          
          // Chat List
          Expanded(
            child: ListView.builder(
              controller: _scrollController,
              padding: const EdgeInsets.all(16),
              itemCount: _messages.length + (_isLoading ? 1 : 0),
              itemBuilder: (context, index) {
                if (index == _messages.length && _isLoading) {
                  return _buildLoadingIndicator();
                }
                final msg = _messages[index];
                return msg.isUser ? _buildUserMessage(msg) : _buildBotMessage(msg);
              },
            ),
          ),
          
          // Input Area
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: const BoxDecoration(
              color: _cardBg,
              border: Border(top: BorderSide(color: _borderColor)),
            ),
            child: SafeArea(
              child: Row(
                children: [
                  Expanded(
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      decoration: BoxDecoration(
                        color: _bgColor,
                        borderRadius: BorderRadius.circular(24),
                        border: Border.all(color: _borderColor),
                      ),
                      child: TextField(
                        controller: _controller,
                        decoration: const InputDecoration(
                          hintText: 'Ask about guidelines, SOPs...',
                          border: InputBorder.none,
                          hintStyle: TextStyle(fontSize: 14, color: _textMuted),
                        ),
                        onSubmitted: (_) => _sendMessage(),
                      ),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Container(
                    decoration: const BoxDecoration(
                      color: _primaryBlue,
                      shape: BoxShape.circle,
                    ),
                    child: IconButton(
                      icon: const Icon(Icons.send, color: Colors.white, size: 18),
                      onPressed: _sendMessage,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUserMessage(ChatMessage msg) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: _primaryBlue,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                  bottomLeft: Radius.circular(16),
                  bottomRight: Radius.circular(4),
                ),
                boxShadow: [
                  BoxShadow(color: Color(0x2609377A), blurRadius: 8, offset: Offset(0, 2)),
                ],
              ),
              child: Text(
                msg.text,
                style: GoogleFonts.nunito(fontSize: 14, color: Colors.white),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBotMessage(ChatMessage msg) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 28,
            margin: const EdgeInsets.only(right: 8),
            decoration: BoxDecoration(
              color: _cardBg,
              shape: BoxShape.circle,
              border: Border.all(color: _borderColor),
            ),
            child: const Center(
              child: Icon(Icons.account_balance, size: 14, color: _primaryBlue),
            ),
          ),
          Flexible(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: const BoxDecoration(
                    color: _cardBg,
                    borderRadius: BorderRadius.only(
                      topLeft: Radius.circular(16),
                      topRight: Radius.circular(16),
                      bottomRight: Radius.circular(16),
                      bottomLeft: Radius.circular(4),
                    ),
                    border: Border.fromBorderSide(BorderSide(color: _borderColor)),
                  ),
                  child: Text(
                    msg.text,
                    style: GoogleFonts.nunito(fontSize: 14, color: _textDark),
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  msg.time,
                  style: GoogleFonts.nunito(fontSize: 10, color: _textMuted),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingIndicator() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.end,
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Container(
            width: 28,
            height: 28,
            margin: const EdgeInsets.only(right: 8),
            decoration: BoxDecoration(
              color: _cardBg,
              shape: BoxShape.circle,
              border: Border.all(color: _borderColor),
            ),
            child: const Center(
              child: Icon(Icons.account_balance, size: 14, color: _primaryBlue),
            ),
          ),
          Flexible(
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: const BoxDecoration(
                color: _cardBg,
                borderRadius: BorderRadius.only(
                  topLeft: Radius.circular(16),
                  topRight: Radius.circular(16),
                  bottomRight: Radius.circular(16),
                  bottomLeft: Radius.circular(4),
                ),
                border: Border.fromBorderSide(BorderSide(color: _borderColor)),
              ),
              child: Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const SizedBox(
                    width: 12,
                    height: 12,
                    child: CircularProgressIndicator(strokeWidth: 2, color: _primaryBlue),
                  ),
                  const SizedBox(width: 8),
                  Text(
                    'Understanding your question...',
                    style: GoogleFonts.nunito(fontSize: 12, fontStyle: FontStyle.italic, color: _textMuted),
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
