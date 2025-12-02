import Image from 'next/image'
export default function SplashScreen() {

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        <Image
          src="/images/logo.png"
          alt="logo"
          width={120}
          height={120}
          priority
        />
        <p className="text-gray-600">Loading...</p>
        <div className="mt-4">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  )
}