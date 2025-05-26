import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Image, ActivityIndicator, TextInput,
    Alert
} from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { save } from '../../../Service/SecureStore';
import { useNavigation } from '@react-navigation/native';

export default function RegisterUser() {
    const [formData, setFormData] = useState({
        FullName: '',
        Email: '',
        ContactNumber: '',
        Password: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigation = useNavigation()
    const validateForm = () => {
        let isValid = true;
        const newErrors = {};

        if (formData.FullName.trim().length < 2) {
            newErrors.FullName = 'Name must be at least 2 characters';
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.Email)) {
            newErrors.Email = 'Please enter a valid email address';
            isValid = false;
        }

        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(formData.ContactNumber)) {
            newErrors.ContactNumber = 'Please enter a valid 10-digit phone number';
            isValid = false;
        }

        if (formData.Password.length < 8) {
            newErrors.Password = 'Password must be at least 8 characters';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const res = await axios.post('https://api.blueaceindia.com/api/v1/Create-User', formData);
            const { success, token } = res.data
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (success) {
                save('token', token)
                Alert.alert("Registration Successful!",
                    "You have successfully registered. You will be redirected to the home page.",
                    [{ text: "Okay", onPress: () => navigation.navigate("home") }]
                );

            }
        } catch (error) {
            console.error('Registration error:', error.response?.data?.message || "An unexpected error occurred.");

            Alert.alert("Registration Failed!",
                error.response?.data?.message || "Something went wrong. Please try again.",
                [{ text: "Okay" }]
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                <View style={styles.header}>
                    <Image
                        source={require('./1695976153902-bcb609.jpg')}
                        style={styles.logo}
                    />
                    <Text style={styles.title}>Blueace AC Services</Text>
                    <Text style={styles.subtitle}>Register for Premium AC Services</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Ionicons name="person-outline" size={24} color="#0066cc" style={styles.icon} />
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Full Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="John Doe"
                                value={formData.FullName}
                                onChangeText={(value) => handleChange('FullName', value)}
                            />
                            {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="mail-outline" size={24} color="#0066cc" style={styles.icon} />
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Email Address</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.Email}
                                onChangeText={(value) => handleChange('Email', value)}
                            />
                            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="call-outline" size={24} color="#0066cc" style={styles.icon} />
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="1234567890"
                                keyboardType="phone-pad"
                                value={formData.ContactNumber}
                                onChangeText={(value) => handleChange('ContactNumber', value)}
                            />
                            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
                        </View>
                    </View>

                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={24} color="#0066cc" style={styles.icon} />
                        <View style={styles.inputWrapper}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.passwordContainer}>
                                <TextInput
                                    style={[styles.input, styles.passwordInput]}
                                    placeholder="Min. 8 characters"
                                    secureTextEntry={!showPassword}
                                    value={formData.Password}
                                    onChangeText={(value) => handleChange('Password', value)}
                                />
                                <TouchableOpacity
                                    style={styles.eyeIcon}
                                    onPress={() => setShowPassword(!showPassword)}
                                >
                                    <Ionicons
                                        name={showPassword ? "eye-off-outline" : "eye-outline"}
                                        size={24}
                                        color="#0066cc"
                                    />
                                </TouchableOpacity>
                            </View>
                            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
                        </View>
                    </View>

                    <TouchableOpacity
                        style={styles.button}
                        onPress={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#ffffff" />
                        ) : (
                            <Text style={styles.buttonText}>Register Now</Text>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.loginLink}
                        onPress={() => navigation.navigate('login')}
                    >
                        <Text style={styles.loginText}>
                            Already have an account? <Text style={styles.loginTextBold}>Login</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f0f8ff' },
    contentContainer: { paddingBottom: 40 },
    header: {
        alignItems: 'center', padding: 20, backgroundColor: '#ffffff',
        borderBottomLeftRadius: 30, borderBottomRightRadius: 30,
        shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
    },
    logo: { width: 120, height: 120, borderRadius: 60, marginBottom: 16 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#0066cc', marginBottom: 8 },
    subtitle: { fontSize: 16, color: '#666666', marginBottom: 8 },
    form: { padding: 20 },
    inputContainer: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
    icon: { marginTop: 24, marginRight: 12 },
    inputWrapper: { flex: 1 },
    label: { fontSize: 14, color: '#333333', marginBottom: 8, fontWeight: '500' },
    input: { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 12, fontSize: 16, borderWidth: 1, borderColor: '#e1e1e1' },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', position: 'relative' },
    eyeIcon: { position: 'absolute', right: 12, height: '100%', justifyContent: 'center' },
    errorText: { color: '#ff3b30', fontSize: 12, marginTop: 4 },
    button: { backgroundColor: '#0066cc', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 20 },
    buttonText: { color: '#ffffff', fontSize: 18, fontWeight: '600' },
    loginLink: { marginTop: 20, alignItems: 'center' },
    loginTextBold: { color: '#0066cc', fontWeight: '600' },
});
