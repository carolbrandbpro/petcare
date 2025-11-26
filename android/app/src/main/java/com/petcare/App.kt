package com.petcare

import android.content.Context
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.petcare.ui.DashboardScreen
import com.petcare.ui.AddPetScreen
import com.petcare.ui.ShareScreen
import com.petcare.ui.LoginScreen

@Composable
fun PetCareApp() {
    val nav: NavHostController = rememberNavController()
    var token by remember { mutableStateOf("") }
    val ctx = nav.context
    LaunchedEffect(Unit) {
        token = ctx.getSharedPreferences("petcare", Context.MODE_PRIVATE).getString("token", "") ?: ""
        if (token.isEmpty()) nav.navigate("login") else nav.navigate("dashboard")
    }
    MaterialTheme {
        Surface { 
            NavHost(navController = nav, startDestination = "login") {
                composable("login") {
                    LoginScreen(onLoggedIn = { t ->
                        ctx.getSharedPreferences("petcare", Context.MODE_PRIVATE).edit().putString("token", t).apply()
                        nav.navigate("dashboard") { popUpTo("login") { inclusive = true } }
                    })
                }
                composable("dashboard") { DashboardScreen(onLogout = {
                    ctx.getSharedPreferences("petcare", Context.MODE_PRIVATE).edit().remove("token").apply()
                    nav.navigate("login") { popUpTo("dashboard") { inclusive = true } }
                }, onAddPet = { nav.navigate("addPet") }, onShare = { nav.navigate("share") }) }
                composable("addPet") { AddPetScreen(onCancel = { nav.navigate("dashboard") { popUpTo("dashboard") { inclusive = true } } }, onSaved = { petId ->
                    ctx.getSharedPreferences("petcare", Context.MODE_PRIVATE).edit().putString("petId", petId).apply()
                    nav.navigate("dashboard") { popUpTo("addPet") { inclusive = true } }
                }) }
                composable("share") { ShareScreen(onClose = { nav.navigate("dashboard") { popUpTo("share") { inclusive = true } } }) }
            }
        }
    }
}