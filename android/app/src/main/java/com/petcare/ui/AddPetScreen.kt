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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import com.petcare.api.PetCreateRequest
import com.petcare.api.PetService
import com.petcare.api.retrofit
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.runBlocking

@Composable
fun AddPetScreen(onCancel: () -> Unit, onSaved: (String) -> Unit) {
    val ctx = LocalContext.current
    var name by remember { mutableStateOf("") }
    var species by remember { mutableStateOf("") }
    var breed by remember { mutableStateOf("") }
    var birth by remember { mutableStateOf("") }
    Column(
        modifier = Modifier.fillMaxSize().padding(PaddingValues(24.dp)),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(text = "Cadastrar Pet")
        OutlinedTextField(value = name, onValueChange = { name = it }, label = { Text("Nome") })
        OutlinedTextField(value = species, onValueChange = { species = it }, label = { Text("Espécie") })
        OutlinedTextField(value = breed, onValueChange = { breed = it }, label = { Text("Raça") })
        OutlinedTextField(value = birth, onValueChange = { birth = it }, label = { Text("Nascimento (AAAA-MM-DD)") }, keyboardOptions = androidx.compose.ui.text.input.KeyboardOptions(keyboardType = KeyboardType.Number))
        Column(modifier = Modifier.padding(top = 12.dp)) {
            Button(onClick = {
                runBlocking(Dispatchers.IO) {
                    val api = retrofit(ctx).create(PetService::class.java)
                    val r = api.create(PetCreateRequest(name.trim(), species.ifBlank { null }, breed.ifBlank { null }, birth.ifBlank { null }))
                    onSaved(r.id)
                }
            }) { Text("Salvar") }
            Button(onClick = onCancel, modifier = Modifier.padding(top = 8.dp)) { Text("Cancelar") }
        }
    }
}