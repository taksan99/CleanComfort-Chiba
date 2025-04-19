"use client"

import { useEffect, useState } from "react"

export default function ServiceList() {
  const [services, setServices] = useState([])

  useEffect(() => {
    async function fetchServices() {
      const response = await fetch("/api/services")
      const data = await response.json()
      setServices(data)
    }
    fetchServices()
  }, [])

  return (
    <div>
      <h2>Our Services</h2>
      <ul>
        {services.map((service) => (
          <li key={service.id}>
            {service.name} - ¥{service.price}
          </li>
        ))}
      </ul>
    </div>
  )
}
