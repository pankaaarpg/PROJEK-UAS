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

type LoginScreenProps = {
  onLogin: (name: string) => void;
};

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = () => {
    if (!name.trim() || !password.trim()) {
      Alert.alert('Login Gagal', 'Nama dan password wajib diisi.');
      return;
    }

    onLogin(name);
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

          <Pressable style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
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
    marginBottom: 28,
  },

  inputGroup: {
    marginBottom: 16,
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
});