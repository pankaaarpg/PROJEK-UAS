import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// === TAMBAHKAN IMPORT DB & FIRESTORE DI SINI ===
import { auth, db } from '../services/firebase/firebaseConfig'; // Tambahkan 'db'
import { signInWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc } from 'firebase/firestore'; // Tambahkan fungsi Firestore

type LoginScreenProps = {
  onLogin: (email: string) => void;
  onGoToSignUp: () => void;
};

export default function LoginScreen({
  onLogin,
  onGoToSignUp,
}: LoginScreenProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Login Gagal', 'Email dan password wajib diisi.');
      return;
    }

    setLoading(true);
    const loginEmail = email.trim();

    try {
      // 1. Proses autentikasi ke Firebase Auth
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, password);
      const user = userCredential.user;

      // 2. JIKA SUKSES: Simpan log sukses ke Firestore 'users_login'
      await addDoc(collection(db, 'users_login'), {
        email: user.email || loginEmail,
        status: 'success',
        timestamp: new Date().toISOString(),
      });

      Alert.alert('Login Sukses', `Selamat datang kembali!`);
      onLogin(user.email || loginEmail);

    } catch (error: any) {
      // Tangani pesan error untuk UI info
      let errorMessage = 'Terjadi kesalahan saat login.';
      if (error.code === 'auth/invalid-credential') {
        errorMessage = 'Email atau password yang Anda masukkan salah.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Format email tidak valid.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'Akun dengan email ini tidak ditemukan.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Password yang Anda masukkan salah.';
      }

      // 3. JIKA GAGAL: Simpan log gagal ke Firestore 'users_login'
      try {
        await addDoc(collection(db, 'users_login'), {
          email: loginEmail,
          status: 'failed',
          reason: error.code || 'unknown_error',
          timestamp: new Date().toISOString(),
        });
      } catch (firestoreError) {
        console.error('Gagal mencatat log error ke Firestore:', firestoreError);
      }

      Alert.alert('Login Gagal', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.wrapper}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.card}>
          <View style={styles.logoBox}>
            <Text style={styles.logoText}>IoT</Text>
          </View>

          <Text style={styles.title}>Selamat Datang</Text>

          <Text style={styles.subtitle}>
            Masuk untuk memantau data perangkat IoT secara mudah dan real-time.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email Anda"
              placeholderTextColor="#86A99A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Masukkan password"
                placeholderTextColor="#86A99A"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!loading}
              />
              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Image
                  source={
                    showPassword
                      ? require('../../assets/eye-off.png')
                      : require('../../assets/eye.png')
                  }
                  style={styles.eyeImage}
                />
              </Pressable>
            </View>
          </View>

          <Pressable 
            style={[styles.button, loading && { opacity: 0.7 }]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </Pressable>

          <Pressable style={styles.signUpWrapper} onPress={onGoToSignUp} disabled={loading}>
            <Text style={styles.signUpText}>
              Belum punya akun? <Text style={styles.signUpLink}>Sign Up</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#064E3B' },
  wrapper: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  card: { backgroundColor: '#ECFDF5', borderRadius: 28, padding: 26, elevation: 8, shadowColor: '#022C22', shadowOpacity: 0.25, shadowOffset: { width: 0, height: 10 }, shadowRadius: 20 },
  logoBox: { width: 76, height: 76, borderRadius: 38, backgroundColor: '#10B981', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20, borderWidth: 4, borderColor: '#A7F3D0' },
  logoText: { color: '#FFFFFF', fontSize: 26, fontWeight: '900' },
  title: { fontSize: 28, fontWeight: '900', color: '#064E3B', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#047857', textAlign: 'center', lineHeight: 20, marginBottom: 28 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '700', color: '#065F46', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: '#064E3B' },
  passwordContainer: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#A7F3D0', borderRadius: 16, flexDirection: 'row', alignItems: 'center' },
  passwordInput: { flex: 1, paddingHorizontal: 16, paddingVertical: 13, fontSize: 15, color: '#064E3B' },
  eyeButton: { paddingHorizontal: 14, paddingVertical: 10 },
  eyeImage: { width: 22, height: 22, resizeMode: 'contain' },
  button: { backgroundColor: '#059669', borderRadius: 16, paddingVertical: 15, alignItems: 'center', marginTop: 8 },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '900' },
  signUpWrapper: { marginTop: 18, alignItems: 'center' },
  signUpText: { fontSize: 13, color: '#047857', fontWeight: '600' },
  signUpLink: { color: '#064E3B', fontWeight: '900' },
});