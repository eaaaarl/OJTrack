import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputFields";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constant/image";
import { useSignInMutation } from "@/features/auth/api/authApi";
import { Link, router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const SignIn = () => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const validateForm = useCallback(() => {
    let isValid = true;
    const newErrors = {
      email: "",
      password: "",
      name: "",
      phone: ""
    };

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }

    if (!form.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }, [form.email, form.password]);

  const [signIn, { isLoading }] = useSignInMutation()

  const onSignInPress = useCallback(async () => {
    setErrors({
      email: "",
      password: "",
    });

    if (!validateForm()) {
      return;
    }


    try {
      const res = await signIn({
        email: form.email,
        password: form.password
      })

      console.log('sign in response', res)

      if (res.error) {
        Alert.alert(
          'Sign in Failed',
          (res.error as { message: string }).message || 'An error occured during sign in',
          [{ text: 'Ok' }]
        )
        return;
      }

      setForm({
        email: '',
        password: ''
      })

      router.replace('/(root)/tabs/home')
    } catch (error) {
      console.error('signup error:', error);
    }

  }, [validateForm, form.email, form.password, signIn]);

  return (
    <>
      <ScrollView
        style={{ flex: 1, backgroundColor: 'white' }}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-white">
          <View className="relative w-full h-[250px]">
            <Image source={images.logo} resizeMode="cover" className="z-0 w-full h-[250px]" />
          </View>
          <View className="p-5">
            <InputField
              label="Email"
              placeholder="Enter email"
              icon={icons.email}
              textContentType="emailAddress"
              value={form.email}
              onChangeText={(value) => {
                setForm({ ...form, email: value });
                if (errors.email) setErrors({ ...errors, email: '' })
              }}
            />
            {errors.email ? (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.email}
              </Text>
            ) : null}
            <InputField
              label="Password"
              placeholder="Enter password"
              icon={icons.lock}
              secureTextEntry={true}
              textContentType="password"
              value={form.password}
              onChangeText={(value) => {
                setForm({ ...form, password: value });
                if (errors.password) setErrors({ ...errors, password: '' })
              }}
            />
            {errors.password ? (
              <Text className="text-red-500 text-sm mt-1 ml-1">
                {errors.password}
              </Text>
            ) : null}
            <CustomButton
              title="Sign In"
              onPress={onSignInPress}
              className="mt-6"
            />

            <OAuth />

            <View
              className="flex-row justify-center items-center mt-10"
              style={{ marginBottom: insets.bottom }}
            >
              <Text className="text-lg text-general-200">
                Don&apos;t have an account?{" "}
              </Text>
              <Link href="/(auth)/sign-up">
                <Text className="text-lg text-primary-500 underline font-medium">
                  Sign Up
                </Text>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>

      <Modal
        transparent
        visible={isLoading}
        animationType="fade"
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}
        >
          <View className="bg-white p-6 rounded-2xl items-center">
            <ActivityIndicator size="large" color="#0286FF" />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SignIn;