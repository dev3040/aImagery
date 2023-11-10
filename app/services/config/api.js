import nextConfig from "@/next.config";
export const GetCaption = () =>
  `${nextConfig.API_URL}/caption`;

export const ValidateUser = (id) =>
  `https://aimageryapi.project-demo.info:3004/v1/users/${id}`

export const Login = () =>
  `https://aimageryapi.project-demo.info:3004/v1/auth/login`

export const SignUp = () =>
  `${nextConfig.API_URL}/signup`

export const Emotion = () =>
  `${nextConfig.API_URL}/emotion`

export const CheckServer = () =>
  `${nextConfig.API_URL}`

export const RegenerateCaption = () => {
  `${nextConfig.API_URL}/recheckCaption`
}