"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, HelpCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import * as LucideIcons from "lucide-react"

interface ServiceContent {
  title: string
  description: string
  items: { name: string; icon: string; desc: string }[]
  features: string[]
  option: string
}

interface ServiceContentEditorProps {
  initialServices: ServiceContent[]
}

// アイコン名とLucideアイコンのマッピング
const iconMap: { [key: string]: keyof typeof LucideIcons } = {
  "water-5": "Droplets",
  kitchen: "Utensils",
  bathroom: "Bath",
  toilet: "Toilet",
  "glass-window": "Maximize",
  balcony: "Home",
  waxing: "Sparkles",
  "air-conditioner": "Wind",
  "air-conditioner-auto": "Cog",
  "air-conditioner-embedded": "SquareAsterisk",
  "air-conditioner-industrial": "Factory",
  "air-conditioner-wide": "ArrowLeftRight",
  "air-conditioner-outdoor": "CloudSun",
  "pest-control": "Bug",
  "grave-visit": "Flower2",
  "pet-care": "Paw",
  "friend-service": "Users",
  gardening: "Scissors",
  "plumbing-service": "Wrench",
  "other-service": "MoreHorizontal",
}

export default function ServiceContentEditor({ initialServices }: ServiceContentEditorProps) {
  const [services, setServices] = useState<ServiceContent[]>(initialServices)
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/content?section=services")
      const data = await response.json()
      if (data && Array.isArray(data)) {
        setServices(data)
      }
    } catch (error) {
      console.error("Error fetching services:", error)
    }
  }

  const handleServiceChange = (index: number, field: keyof ServiceContent, value: any) => {
    const newServices = [...services]
    newServices[index] = { ...newServices[index], [field]: value }
    setServices(newServices)
  }

  const handleItemChange = (
    serviceIndex: number,
    itemIndex: number,
    field: keyof ServiceContent["items"][0],
    value: string,
  ) => {
    const newServices = [...services]
    newServices[serviceIndex].items[itemIndex] = { ...newServices[serviceIndex].items[itemIndex], [field]: value }
    setServices(newServices)
  }

  const handleAddItem = (serviceIndex: number) => {
    const newServices = [...services]
    newServices[serviceIndex].items.push({ name: "", icon: "HelpCircle", desc: "" })
    setServices(newServices)
  }

  const handleRemoveItem = (serviceIndex: number, itemIndex: number) => {
    const newServices = [...services]
    newServices[serviceIndex].items.splice(itemIndex, 1)
    setServices(newServices)
  }

  const handleSave = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "services",
          content: services,
        }),
      })

      if (response.ok) {
        toast({
          title: "保存完了",
          description: "サービス内容が正常に保存されました。",
        })
      } else {
        throw new Error("Failed to save")
      }
    } catch (error) {
      console.error("Error saving services:", error)
      toast({
        title: "エラー",
        description: "保存に失敗しました。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const iconOptions = Object.keys(iconMap).filter((key) => LucideIcons[iconMap[key] as keyof typeof LucideIcons])

  return (
    <div className="space-y-4">
      <Tabs defaultValue="houseCleaning">
        <TabsList>
          <TabsTrigger value="houseCleaning">ハウスクリーニング</TabsTrigger>
          <TabsTrigger value="airConCleaning">エアコンクリーニング</TabsTrigger>
          <TabsTrigger value="handymanService">便利屋サービス</TabsTrigger>
        </TabsList>
        {services.map((service, serviceIndex) => (
          <TabsContent key={serviceIndex} value={["houseCleaning", "airConCleaning", "handymanService"][serviceIndex]}>
            <Card>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block mb-2">説明</label>
                  <Textarea
                    value={service.description}
                    onChange={(e) => handleServiceChange(serviceIndex, "description", e.target.value)}
                    placeholder="サービスの説明"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block mb-2">提供サービス</label>
                  {service.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex space-x-2 mb-2">
                      <Input
                        value={item.name}
                        onChange={(e) => handleItemChange(serviceIndex, itemIndex, "name", e.target.value)}
                        placeholder="サービス名"
                      />
                      <Select
                        value={item.icon}
                        onValueChange={(value) => handleItemChange(serviceIndex, itemIndex, "icon", value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="アイコンを選択" />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((iconName) => {
                            const IconComponent =
                              LucideIcons[iconMap[iconName] as keyof typeof LucideIcons] || HelpCircle
                            return (
                              <SelectItem key={iconName} value={iconName}>
                                <div className="flex items-center">
                                  <IconComponent className="mr-2" size={16} />
                                  {iconName}
                                </div>
                              </SelectItem>
                            )
                          })}
                        </SelectContent>
                      </Select>
                      <Textarea
                        value={item.desc}
                        onChange={(e) => handleItemChange(serviceIndex, itemIndex, "desc", e.target.value)}
                        placeholder="説明"
                        rows={1}
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => handleRemoveItem(serviceIndex, itemIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button variant="outline" onClick={() => handleAddItem(serviceIndex)} className="mt-2">
                    <Plus className="h-4 w-4 mr-2" />
                    項目を追加
                  </Button>
                </div>
                <div>
                  <label className="block mb-2">サービスの特徴（各項目を改行で区切ってください）</label>
                  <Textarea
                    value={service.features.join("\n")}
                    onChange={(e) =>
                      handleServiceChange(serviceIndex, "features", e.target.value.split("\n").filter(Boolean))
                    }
                    placeholder="サービスの特徴"
                    rows={4}
                  />
                </div>
                <div>
                  <label className="block mb-2">オプションサービス</label>
                  <Textarea
                    value={service.option}
                    onChange={(e) => handleServiceChange(serviceIndex, "option", e.target.value)}
                    placeholder="オプションサービス"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading ? "保存中..." : "保存"}
      </Button>
    </div>
  )
}
