package com.petcare.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Menu
import androidx.compose.material3.Button
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.ModalNavigationDrawer
import androidx.compose.material3.NavigationDrawerItem
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.rememberDrawerState
import androidx.compose.material3.DrawerState
import androidx.compose.material3.DrawerValue
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.ui.draw.clip
import com.petcare.api.UsersService
import com.petcare.api.retrofit
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.layout.ContentScale
import coil.compose.SubcomposeAsyncImage
import coil.request.ImageRequest
import com.petcare.api.baseUrl
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.material3.ButtonDefaults

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(onLogout: () -> Unit, onAddPet: () -> Unit, onShare: () -> Unit) {
    val drawerState: DrawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    var showSheet by remember { mutableStateOf(false) }
    val ctx = LocalContext.current
    var userName by remember { mutableStateOf("") }
    var userEmail by remember { mutableStateOf("") }
    var userAvatarUrl by remember { mutableStateOf<String?>(null) }
    LaunchedEffect(Unit) {
        try {
            val api = retrofit(ctx).create(UsersService::class.java)
            val u = api.me()
            userName = (u.name ?: "").ifBlank { "Usuário" }
            userEmail = u.email
            userAvatarUrl = u.avatar_url?.let { if (it.startsWith("/")) "${baseUrl(ctx)}$it" else it }
        } catch (_: Exception) { }
    }
    ModalNavigationDrawer(
        drawerState = drawerState,
        drawerContent = {
            Column(modifier = Modifier.padding(12.dp)) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    if (!userAvatarUrl.isNullOrBlank()) {
                        SubcomposeAsyncImage(
                            model = ImageRequest.Builder(ctx).data(userAvatarUrl).crossfade(true).build(),
                            contentDescription = null,
                            modifier = Modifier.size(40.dp).clip(CircleShape),
                            contentScale = ContentScale.Crop,
                            loading = {
                                Text(text = (userName.split(" ").firstOrNull() ?: "U").take(2).uppercase(), modifier = Modifier.size(40.dp).clip(CircleShape).background(androidx.compose.ui.graphics.Color(0xFF03989F)).padding(8.dp))
                            },
                            error = {
                                Text(text = (userName.split(" ").firstOrNull() ?: "U").take(2).uppercase(), modifier = Modifier.size(40.dp).clip(CircleShape).background(androidx.compose.ui.graphics.Color(0xFF03989F)).padding(8.dp))
                            }
                        )
                    } else {
                        Text(text = (userName.split(" ").firstOrNull() ?: "U").take(2).uppercase(), modifier = Modifier.size(40.dp).clip(CircleShape).background(androidx.compose.ui.graphics.Color(0xFF03989F)).padding(8.dp))
                    }
                    Column(modifier = Modifier.padding(start = 8.dp)) {
                        Text(userName)
                        if (userEmail.isNotBlank()) Text(userEmail)
                    }
                }
                NavigationDrawerItem(label = { Text("Meu Perfil") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Medicamentos") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Vacinas") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Exames") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Antipulgas") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Banho") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Lembretes") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Compartilhar") }, selected = false, onClick = onShare)
                NavigationDrawerItem(label = { Text("Consultar") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Peso") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Higiene") }, selected = false, onClick = {})
                NavigationDrawerItem(label = { Text("Sair") }, selected = false, onClick = onLogout)
            }
        }
    ) {
        Column(
            modifier = Modifier.fillMaxSize().padding(PaddingValues(24.dp)),
            horizontalAlignment = Alignment.Start,
            verticalArrangement = Arrangement.Top
        ) {
            TopAppBar(
                title = { Text("Olá ${userName.split(" ").firstOrNull() ?: "Usuário"}") },
                navigationIcon = { Icon(imageVector = Icons.Default.Menu, contentDescription = "Menu") },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.primary,
                    titleContentColor = MaterialTheme.colorScheme.onPrimary,
                    navigationIconContentColor = MaterialTheme.colorScheme.onPrimary
                )
            )
            Button(
                onClick = { showSheet = true },
                modifier = Modifier.padding(top = 12.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.secondary,
                    contentColor = MaterialTheme.colorScheme.onSecondary
                )
            ) { Icon(Icons.Default.Add, contentDescription = null); Text("Adicionar Novo Pet +") }
            if (showSheet) {
                ModalBottomSheet(onDismissRequest = { showSheet = false }) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Button(onClick = { showSheet = false; onAddPet() }) { Text("Criar um pet novo") }
                        Button(onClick = { showSheet = false; onShare() }, modifier = Modifier.padding(top = 8.dp)) { Text("Usar um código de compartilhamento") }
                    }
                }
            }
        }
    }
}