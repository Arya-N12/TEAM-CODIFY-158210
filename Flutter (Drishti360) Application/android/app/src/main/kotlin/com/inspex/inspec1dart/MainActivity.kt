package com.inspex.inspec1dart

import android.app.Activity
import android.content.Intent
import androidx.annotation.NonNull
import io.flutter.embedding.android.FlutterActivity
import io.flutter.embedding.engine.FlutterEngine
import io.flutter.plugin.common.MethodChannel
import android.content.Context
import androidx.security.crypto.EncryptedFile
import androidx.security.crypto.MasterKey
import java.io.File

class MainActivity : FlutterActivity() {
    private val CHANNEL = "com.inspex.inspec1dart/geotag"
    private var pendingResult: MethodChannel.Result? = null
    private val CAMERA_REQUEST_CODE = 1001

    override fun configureFlutterEngine(@NonNull flutterEngine: FlutterEngine) {
        super.configureFlutterEngine(flutterEngine)
        MethodChannel(flutterEngine.dartExecutor.binaryMessenger, CHANNEL).setMethodCallHandler { call, result ->
            if (call.method == "launchCamera") {
                pendingResult = result
                val intent = Intent(this, GeoTagCameraActivity::class.java)
                startActivityForResult(intent, CAMERA_REQUEST_CODE)
            } else if (call.method == "getVaultImages") {
                try {
                    val vaultDir = getDir("vault_images", Context.MODE_PRIVATE)
                    val files = vaultDir.listFiles()?.map { it.name } ?: emptyList()
                    result.success(files)
                } catch (e: Exception) {
                    result.error("ERROR", e.message, null)
                }
            } else if (call.method == "getDecryptedImage") {
                val fileName = call.argument<String>("fileName")
                if (fileName != null) {
                    try {
                        val vaultDir = getDir("vault_images", Context.MODE_PRIVATE)
                        val file = File(vaultDir, fileName)
                        if (file.exists()) {
                            val masterKey = MasterKey.Builder(this)
                                .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                                .build()
                            
                            val encryptedFile = EncryptedFile.Builder(
                                this,
                                file,
                                masterKey,
                                EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
                            ).build()
                            
                            val inputStream = encryptedFile.openFileInput()
                            val bytes = inputStream.readBytes()
                            inputStream.close()
                            
                            result.success(bytes)
                        } else {
                            result.error("NOT_FOUND", "File not found", null)
                        }
                    } catch (e: Exception) {
                        result.error("ERROR", e.message, null)
                    }
                } else {
                    result.error("INVALID_ARG", "Filename is required", null)
                }
            } else {
                result.notImplemented()
            }
        }
    }

    override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
        super.onActivityResult(requestCode, resultCode, data)
        if (requestCode == CAMERA_REQUEST_CODE) {
            if (resultCode == Activity.RESULT_OK) {
                val imagePath = data?.getStringExtra("image_path")
                pendingResult?.success(imagePath)
            } else {
                pendingResult?.error("CANCELLED", "User cancelled capture", null)
            }
            pendingResult = null
        }
    }
}
