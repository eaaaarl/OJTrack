import CustomButton from "@/components/CustomButton";
import InputField from "@/components/InputFields";
import OAuth from "@/components/OAuth";
import { icons, images } from "@/constant/image";
import { Link } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
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

  const onSignInPress = useCallback(async () => {
    console.log('forms', form)
  }, [form]);

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

              }}
            />

            <InputField
              label="Password"
              placeholder="Enter password"
              icon={icons.lock}
              secureTextEntry={true}
              textContentType="password"
              value={form.password}
              onChangeText={(value) => {
                setForm({ ...form, password: value });
              }}
            />

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

      {/*  <Modal
        transparent
        visible={isLoading}
        animationType="fade"
      >
        <View
          className="flex-1 justify-center items-center"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        >
          <View className="bg-white p-6 rounded-2xl items-center">
            <ActivityIndicator size="large" color="#0286FF" />
            <Text className="mt-4 text-base text-gray-700 font-medium">
              Signing in...
            </Text>
          </View>
        </View>
      </Modal> */}
    </>
  );
};

export default SignIn;