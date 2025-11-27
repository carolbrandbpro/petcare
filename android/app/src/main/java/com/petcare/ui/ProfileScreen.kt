package com.petcare.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Button
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.petcare.api.UsersService
import com.petcare.api.retrofit
import com.petcare.api.UpdateUser
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import com.google.android.gms.common.api.ApiException

@Composable
fun ProfileScreen(onClose: () -> Unit) {
    val ctx = LocalContext.current
    var name by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }
    var avatar by remember { mutableStateOf("") }
    var loaded by remember { mutableStateOf(false) }
    if (!loaded) {
        runBlocking(Dispatchers.IO) {
            val api = retrofit(ctx).create(UsersService::class.java)
            val u = api.me()
            name = u.name ?: ""
            email = u.email
            avatar = u.avatar_url ?: ""
            loaded = true
        }
    }
    Column(
        modifier = Modifier.fillMaxSize().padding(PaddingValues(24.dp)),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Meu Perfil")
        OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Nome") })
        OutlinedTextField(value = email, onValueChange = {}, label = { Text("E-mail") }, enabled = false)
        val webClientId = try { ctx.resources.getString(ctx.resources.getIdentifier("google_web_client_id", "string", ctx.packageName)) } catch (_: Exception) { "" }
        val launcher = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(ApiException::class.java)
                val displayName = account.displayName ?: name
                val photoUrl = account.photoUrl?.toString() ?: avatar
                runBlocking(Dispatchers.IO) {
                    val api = retrofit(ctx).create(UsersService::class.java)
                    api.update(UpdateUser(displayName, photoUrl))
                }
                name = displayName
                avatar = photoUrl
            } catch (_: Exception) { }
        }
        Button(onClick = {
            if (webClientId.isBlank()) return@Button
            val gso = GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .requestIdToken(webClientId)
                .build()
            val client = GoogleSignIn.getClient(ctx, gso)
            launcher.launch(client.signInIntent)
        }, modifier = Modifier.padding(top = 12.dp)) { Text("Conectar Google") }
        Button(onClick = onClose, modifier = Modifier.padding(top = 12.dp)) { Text("Voltar") }
    }
}