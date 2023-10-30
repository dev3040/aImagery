import nextConfig from "@/next.config";
export const GetCaption = () =>
  `${nextConfig.API_URL}/caption`;

export const ValidateUser = (id) =>
  `${nextConfig.API_URL}/profile/${id}`

export const Login = () =>
  `${nextConfig.API_URL}/login`

export const SignUp = () =>
  `${nextConfig.API_URL}/signup`

export const Emotion = () =>
  `${nextConfig.API_URL}/emotion`

export const CheckServer = () =>
  `${nextConfig.API_URL}`