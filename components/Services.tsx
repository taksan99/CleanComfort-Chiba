import type React from "react"
import Image from "next/image"

const Services: React.FC = () => {
  const services = [
    { name: "エアコンクリーニング", image: "/placeholder.svg?height=200&width=300" },
    { name: "ハウスクリーニング", image: "/placeholder.svg?height=200&width=300" },
    { name: "カーペットクリーニング", image: "/placeholder.svg?height=200&width=300" },
    { name: "水回りクリーニング", image: "/placeholder.svg?height=200&width=300" },
  ]

  return (
    <section className="py-12 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-8">提供サービス</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Image
                src={service.image || "/placeholder.svg"}
                alt={service.name}
                width={300}
                height={200}
                className="w-full"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600">詳細はお問い合わせください。</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
