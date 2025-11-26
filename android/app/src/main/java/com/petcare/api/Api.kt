package com.petcare.api

import android.content.Context
import okhttp3.Interceptor
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.http.Body
import retrofit2.http.POST

data class LoginRequest(val email: String, val password: String)
data class LoginResponse(val token: String, val user: UserDto)
data class UserDto(val id: String, val email: String, val name: String?)
data class UserProfile(val id: String, val email: String, val name: String?, val avatar_url: String?)

class AuthInterceptor(private val context: Context) : Interceptor {
    override fun intercept(chain: Interceptor.Chain): Response {
        val prefs = context.getSharedPreferences("petcare", Context.MODE_PRIVATE)
        val t = prefs.getString("token", null)
        val req: Request = if (!t.isNullOrBlank()) {
            chain.request().newBuilder().addHeader("Authorization", "Bearer $t").build()
        } else chain.request()
        return chain.proceed(req)
    }
}

fun baseUrl(context: Context): String {
    return "http://10.0.2.2:4001"
}

fun retrofit(context: Context): Retrofit {
    val client = OkHttpClient.Builder().addInterceptor(AuthInterceptor(context)).build()
    return Retrofit.Builder().baseUrl(baseUrl(context)).client(client).addConverterFactory(GsonConverterFactory.create()).build()
}

interface AuthService {
    @POST("/api/auth/login")
    suspend fun login(@Body body: LoginRequest): LoginResponse
}

interface UsersService {
    @retrofit2.http.GET("/api/users/me")
    suspend fun me(): UserProfile
}