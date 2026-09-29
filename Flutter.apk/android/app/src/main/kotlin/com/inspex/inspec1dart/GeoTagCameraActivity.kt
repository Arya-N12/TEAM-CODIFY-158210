package com.inspex.inspec1dart

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.graphics.ImageDecoder
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.os.Environment
import android.provider.MediaStore
import android.text.Editable
import android.text.TextWatcher
import android.util.Log
import android.view.View
import android.widget.Toast
import android.os.Handler
import android.os.Looper
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.TimeZone
import androidx.activity.addCallback
import androidx.activity.result.ActivityResultLauncher
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.FragmentActivity
import com.dangiashish.PermissionCallback
import com.dangiashish.GeoTagImage
import com.dangiashish.GeoTagImage.Companion.JPEG
import com.dangiashish.GeoTagImage.Companion.PNG
import com.dangiashish.GeoTagImage.Companion.RATIO_16X9
import com.dangiashish.GeoTagImage.Companion.RATIO_1X1
import com.dangiashish.GeoTagImage.Companion.RATIO_4X3
import com.dangiashish.GeoTagImage.Companion.RATIO_FULL
import java.io.File
import java.io.FileInputStream
import java.text.DecimalFormat
import com.inspex.inspec1dart.databinding.ActivityGeotagBinding
import com.inspex.inspec1dart.R
import androidx.security.crypto.EncryptedFile
import androidx.security.crypto.MasterKey

class GeoTagCameraActivity : AppCompatActivity(), PermissionCallback {
    private var gtiUri: Uri? = null
    private lateinit var gti: GeoTagImage
    private lateinit var cameraLauncher: ActivityResultLauncher<Uri>
    private lateinit var permissionLauncher: ActivityResultLauncher<Array<String>>
    
    private val timeHandler = Handler(Looper.getMainLooper())
    private lateinit var timeRunnable: Runnable

    private val TAG = "GeoTagImageLog"
    private val binding: ActivityGeotagBinding by lazy { ActivityGeotagBinding.inflate(layoutInflater) }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(binding.root)

        mContext = this@GeoTagCameraActivity

        onBackPressedDispatcher.addCallback {
            clearAppData(this@GeoTagCameraActivity)
            setResult(Activity.RESULT_CANCELED)
            finish()
        }
        
        timeRunnable = object : Runnable {
            override fun run() {
                try {
                    val sdf = SimpleDateFormat("yyyy-MM-dd hh:mm:ss a 'IST'", Locale.getDefault())
                    sdf.timeZone = TimeZone.getTimeZone("Asia/Kolkata")
                    binding.tvDate.text = sdf.format(Date())
                } catch (e: Exception) {
                    e.printStackTrace()
                }
                timeHandler.postDelayed(this, 1000)
            }
        }
        timeHandler.post(timeRunnable)

        permissionLauncher = registerForActivityResult(
            ActivityResultContracts.RequestMultiplePermissions()
        ) { permissions ->
            val allGranted = permissions.all { it.value }
            if (allGranted) {
                onPermissionGranted()
            } else {
                onPermissionDenied()
            }
        }

        cameraLauncher =
            registerForActivityResult(ActivityResultContracts.TakePicture()) { success ->
                if (success) {
                    gtiUri = gti.processCapturedImage()
                    previewCapturedImage()
                } else {
                    Toast.makeText(mContext, "Failed to capture photo", Toast.LENGTH_SHORT).show()
                }
            }

        gti = GeoTagImage(this, permissionLauncher, cameraLauncher)
        
        gti.onLocationUpdated = { lat, lng, address, city, country ->
            binding.tvLatLong.text = "Lat Long : $lat, $lng"
            binding.tvAddress.text = address
            binding.tvCity.text = "$city, $country"
        }
        
        gti.requestCameraAndLocationPermissions()
        gti.enableCameraX(true)
        gti.setDateFormat("yyyy-MM-dd HH:mm:ss")

        gti.showAuthorName(true)
        gti.showAppName(true)
        gti.setAuthorName("")
        gti.setAppName("")

        binding.ivCamera.setOnClickListener {
            if (binding.gtiFeature.isChecked) {
                if (binding.sAuthor.isChecked && binding.etAuthorName.text.toString().trim().isEmpty()) {
                    Toast.makeText(mContext, "Please enter Officer ID", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
                if (binding.sApp.isChecked && binding.etAppName.text.toString().trim().isEmpty()) {
                    Toast.makeText(mContext, "Please enter app name", Toast.LENGTH_SHORT).show()
                    return@setOnClickListener
                }
            }
            gti.launchCamera(
                onImageCaptured = { uri ->
                    if (uri != null) {
                        gtiUri = uri
                        previewCapturedImage()
                    } else {
                        Toast.makeText(mContext, "Failed to capture photo", Toast.LENGTH_SHORT).show()
                    }
                },
                onFailure = {
                    Toast.makeText(mContext, it, Toast.LENGTH_SHORT).show()
                }
            )
        }

        binding.gtiFeature.setOnCheckedChangeListener { _, isChecked ->
            gti.enableGTIService(isChecked)
            if (!isChecked) {
                gti.showAuthorName(false)
                binding.etAuthorName.visibility = View.GONE
                binding.sAuthor.isChecked = false
                gti.showAppName(false)
                binding.sApp.isChecked = false
                gti.showLatLng(false)
                binding.sLatLng.isChecked = false
                gti.showDate(false)
                binding.sDate.isChecked = false
                gti.showGoogleMap(false)
                binding.sMap.isChecked = false
                binding.cardPreview.visibility = View.GONE
            } else {
                binding.cardPreview.visibility = View.VISIBLE
            }
        }

        binding.sAuthor.setOnCheckedChangeListener { _, isChecked ->
            gti.showAuthorName(isChecked)
            binding.etAuthorName.visibility = if (isChecked) View.VISIBLE else View.GONE
            binding.tvAuthor.visibility = if (isChecked) View.VISIBLE else View.GONE
        }

        binding.etDirectoryName.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                gti.setDirectory(s.toString().trim())
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        binding.etAuthorName.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val text = s.toString().trim()
                gti.setAuthorName(text)
                binding.tvAuthor.text = if (text.isNotEmpty()) "Captured By Officer ID = $text" else ""
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        binding.sApp.setOnCheckedChangeListener { _, isChecked ->
            gti.showAppName(isChecked)
            binding.etAppName.visibility = if (isChecked) View.VISIBLE else View.GONE
            binding.tvAppName.visibility = if (isChecked) View.VISIBLE else View.GONE
        }

        binding.etAppName.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                val text = s.toString().trim()
                gti.setAppName(text)
                binding.tvAppName.text = if (text.isNotEmpty()) "Captured via $text" else ""
            }
            override fun afterTextChanged(s: Editable?) {}
        })

        binding.sLatLng.setOnCheckedChangeListener { _, isChecked ->
            gti.showLatLng(isChecked)
            binding.tvLatLong.visibility = if (isChecked) View.VISIBLE else View.GONE
        }

        binding.sDate.setOnCheckedChangeListener { _, isChecked ->
            gti.showDate(isChecked)
            binding.tvDate.visibility = if (isChecked) View.VISIBLE else View.GONE
        }

        binding.sMap.setOnCheckedChangeListener { _, isChecked ->
            gti.showGoogleMap(isChecked)
        }

        binding.toggleCamera.check(R.id.toggle_camera_x)
        binding.toggleCamera.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                when (checkedId) {
                    R.id.toggle_camera_x -> gti.enableCameraX(true)
                    R.id.toggle_system_camera -> gti.enableCameraX(false)
                }
            }
        }

        binding.toggleAppearanceRandom.check(R.id.button_ext_png)
        gti.setImageExtension(PNG)
        binding.toggleAppearanceRandom.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                when (checkedId) {
                    R.id.button_ext_png -> gti.setImageExtension(PNG)
                    R.id.button_ext_jpeg -> gti.setImageExtension(JPEG)
                }
            }
        }

        binding.toggleCameraRatio.check(R.id.button_rat_1)
        gti.setCameraAspectRatio(RATIO_1X1)
        binding.toggleCameraRatio.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                when (checkedId) {
                    R.id.button_rat_1 -> gti.setCameraAspectRatio(RATIO_1X1)
                    R.id.button_rat_2 -> gti.setCameraAspectRatio(RATIO_4X3)
                    R.id.button_rat_3 -> gti.setCameraAspectRatio(RATIO_16X9)
                    R.id.button_rat_4 -> gti.setCameraAspectRatio(RATIO_FULL)
                }
            }
        }

        binding.toggleMapView.check(R.id.button_satellite)
        gti.setMapView(GeoTagImage.MapViewType.SATELLITE)
        binding.toggleMapView.addOnButtonCheckedListener { _, checkedId, isChecked ->
            if (isChecked) {
                when (checkedId) {
                    R.id.button_satellite -> gti.setMapView(GeoTagImage.MapViewType.SATELLITE)
                    R.id.button_hybrid -> gti.setMapView(GeoTagImage.MapViewType.HYBRID)
                    R.id.button_terrain -> gti.setMapView(GeoTagImage.MapViewType.TERRAIN)
                    R.id.button_roadmap -> gti.setMapView(GeoTagImage.MapViewType.ROADMAP)
                }
            }
        }
        
        binding.btnSave.setOnClickListener {
            try {
                val originalFile = gtiUri?.path?.let { File(it) }
                if (originalFile != null && originalFile.exists()) {
                    val masterKey = MasterKey.Builder(this)
                        .setKeyScheme(MasterKey.KeyScheme.AES256_GCM)
                        .build()

                    val vaultDir = getDir("vault_images", Context.MODE_PRIVATE)
                    if (!vaultDir.exists()) vaultDir.mkdirs()

                    val encryptedFileName = "ENC_${System.currentTimeMillis()}.png"
                    val encryptedFile = File(vaultDir, encryptedFileName)

                    val encryptedFileObject = EncryptedFile.Builder(
                        this,
                        encryptedFile,
                        masterKey,
                        EncryptedFile.FileEncryptionScheme.AES256_GCM_HKDF_4KB
                    ).build()

                    FileInputStream(originalFile).use { inputStream ->
                        encryptedFileObject.openFileOutput().use { outputStream ->
                            inputStream.copyTo(outputStream)
                        }
                    }

                    originalFile.delete()

                    val resultIntent = Intent()
                    resultIntent.putExtra("image_path", encryptedFileName) // Return just the filename or unique ID
                    setResult(Activity.RESULT_OK, resultIntent)
                    finish()
                } else {
                    Toast.makeText(this, "Failed to locate image.", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                e.printStackTrace()
                Toast.makeText(this, "Encryption error: ${e.message}", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun previewCapturedImage() {
        gtiUri?.let { uri ->
            binding.ivImage.let { imageView ->
                try {
                    val bitmap = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
                        ImageDecoder.decodeBitmap(ImageDecoder.createSource(contentResolver, uri))
                    } else {
                        @Suppress("DEPRECATION")
                        MediaStore.Images.Media.getBitmap(contentResolver, uri)
                    }
                    imageView.setImageBitmap(bitmap)
                    imageView.visibility = View.VISIBLE
                    binding.ivClose.visibility = View.VISIBLE
                    binding.btnSave.visibility = View.VISIBLE
                    binding.progressBar.visibility = View.GONE
                    binding.tvGTIPath.text = gtiUri?.path
                    binding.tvImgSize.text = getFileSize(gtiUri?.path!!)

                } catch (e: Exception) {
                    Log.e(TAG, "Error loading image: ${e.message}")
                }
            }
            binding.ivClose.setOnClickListener { _ ->
                binding.ivImage.setImageBitmap(null)
                binding.ivCamera.visibility = View.VISIBLE
                binding.ivClose.visibility = View.GONE
                binding.btnSave.visibility = View.GONE
                binding.ivImage.setImageDrawable(null)
                binding.tvGTIPath.text = ""
                binding.tvImgSize.text = ""
            }
        }
    }

    override fun onDestroy() {
        super.onDestroy()
        timeHandler.removeCallbacks(timeRunnable)
    }

    override fun onPermissionGranted() {
        gti.fetchCurrentLocation {}
    }

    override fun onPermissionDenied() {
        gti.requestCameraAndLocationPermissions()
    }

    companion object {
        lateinit var mContext: FragmentActivity
    }

    private fun getFileSize(filePath: String?): String {
        val file = filePath?.let { File(it) }
        if (file!!.exists()) {
            val fileSizeInBytes = file.length()
            val fileSizeInKB = fileSizeInBytes / 1024.0
            val fileSizeInMB = fileSizeInKB / 1024.0
            val decimalFormat = DecimalFormat("#.##")
            return when {
                fileSizeInMB >= 1 -> "~ ${decimalFormat.format(fileSizeInMB)} MB"
                fileSizeInKB >= 1 -> "~ ${decimalFormat.format(fileSizeInKB)} KB"
                else -> "~ $fileSizeInBytes Bytes"
            }
        }
        return ""
    }

    private fun clearAppData(context: Context) {
        try {
            val picturesDir = getExternalFilesDir(Environment.DIRECTORY_PICTURES)
            var success = true
            picturesDir?.listFiles()?.forEach { file ->
                if (file.isFile) {
                    success = success && file.delete()
                }
            }
            gti.cleanup()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}
