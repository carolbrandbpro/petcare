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
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import androidx.compose.ui.platform.LocalContext
import com.petcare.api.AuthService
import com.petcare.api.LoginRequest
import com.petcare.api.GoogleLoginRequest
import com.petcare.api.retrofit
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking
import com.google.android.gms.auth.api.signin.GoogleSignIn
import com.google.android.gms.auth.api.signin.GoogleSignInOptions
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import com.google.android.gms.common.api.ApiException

@Composable
fun LoginScreen(onLoggedIn: (String) -> Unit) {
    val ctx = LocalContext.current
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    Column(
        modifier = Modifier.fillMaxSize().padding(PaddingValues(24.dp)),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "PetCare — Demo")
        OutlinedTextField(value = email, onValueChange = { email = it }, label = { Text("Email") })
        OutlinedTextField(value = password, onValueChange = { password = it }, label = { Text("Senha") }, visualTransformation = PasswordVisualTransformation())
        Button(onClick = {
            runBlocking(Dispatchers.IO) {
                val api = retrofit(ctx).create(AuthService::class.java)
                val r = api.login(LoginRequest(email.trim(), password.trim()))
                onLoggedIn(r.token)
            }
        }, modifier = Modifier.padding(top = 12.dp)) { Text("Entrar") }

        val webClientId = try { ctx.resources.getString(ctx.resources.getIdentifier("google_web_client_id", "string", ctx.packageName)) } catch (_: Exception) { "" }
        val launcher = rememberLauncherForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            val task = GoogleSignIn.getSignedInAccountFromIntent(result.data)
            try {
                val account = task.getResult(ApiException::class.java)
                val idToken = account.idToken
                if (!idToken.isNullOrBlank()) {
                    runBlocking(Dispatchers.IO) {
                        val api = retrofit(ctx).create(AuthService::class.java)
                        val r = api.google(GoogleLoginRequest(idToken))
                        onLoggedIn(r.token)
                    }
                }
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
        }, modifier = Modifier.padding(top = 12.dp)) { Text("Entrar com Google") }
    }
}