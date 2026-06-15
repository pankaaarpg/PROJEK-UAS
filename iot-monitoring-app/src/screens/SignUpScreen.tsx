import React, { useState } from 'react';
import {
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

type SignUpScreenProps = {
  onGoToLogin: () => void;
};

export default function SignUpScreen({ onGoToLogin }: SignUpScreenProps) {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const handleSignUp = () => {
    if (
      !name.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      Alert.alert('Sign Up Gagal', 'Semua data wajib diisi.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Sign Up Gagal', 'Password dan konfirmasi password tidak sama.');
      return;
    }

    Alert.alert(
      'Sign Up Berhasil',
      'Akun berhasil dibuat. Silakan login.',
      [
        {
          text: 'OK',
          onPress: onGoToLogin,
        },
      ]
    );
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

          <Text style={styles.title}>Buat Akun</Text>

          <Text style={styles.subtitle}>
            Daftar untuk mulai menggunakan aplikasi monitoring perangkat IoT.
          </Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Nama</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan nama"
              placeholderTextColor="#86A99A"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Masukkan email"
              placeholderTextColor="#86A99A"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
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

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Konfirmasi Password</Text>

            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="Ulangi password"
                placeholderTextColor="#86A99A"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
              />

              <Pressable
                style={styles.eyeButton}
                onPress={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                <Image
                  source={
                    showConfirmPassword
                      ? require('../../assets/eye-off.png')
                      : require('../../assets/eye.png')
                  }
                  style={styles.eyeImage}
                />
              </Pressable>
            </View>
          </View>

          <Pressable style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </Pressable>

          <Pressable style={styles.loginWrapper} onPress={onGoToLogin}>
            <Text style={styles.loginText}>
              Sudah punya akun? <Text style={styles.loginLink}>Login</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#064E3B',
  },

  wrapper: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  card: {
    backgroundColor: '#ECFDF5',
    borderRadius: 28,
    padding: 26,
    shadowColor: '#022C22',
    shadowOpacity: 0.25,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowRadius: 20,
    elevation: 8,
  },

  logoBox: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: '#10B981',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 4,
    borderColor: '#A7F3D0',
  },

  logoText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
  },

  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#064E3B',
    textAlign: 'center',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 14,
    color: '#047857',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },

  inputGroup: {
    marginBottom: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
    marginBottom: 8,
  },

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#064E3B',
  },

  passwordContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },

  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: '#064E3B',
  },

  eyeButton: {
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  eyeImage: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
  },

  button: {
    backgroundColor: '#059669',
    borderRadius: 16,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '900',
  },

  loginWrapper: {
    marginTop: 18,
    alignItems: 'center',
  },

  loginText: {
    fontSize: 13,
    color: '#047857',
    fontWeight: '600',
  },

  loginLink: {
    color: '#064E3B',
    fontWeight: '900',
  },
});