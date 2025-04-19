import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Droplet, Wind, Wrench } from "lucide-react"

const iconMap = {
  掃除サービス: Droplet,
  エアコン掃除: Wind,
  便利屋さんサービス: Wrench,
}

const services = [
  {
    category: "掃除サービス",
    items: [
      { service: "水回り5点セット（浴室/キッチン/レンジフード/トイレ/洗面台）", price: "68,000円～" },
      { service: "浴室、キッチン、レンジフード", price: "20,000円～" },
      { service: "トイレ", price: "10,000円～" },
      { service: "ガラス・サッシクリーニング（3枚）", price: "10,000円～" },
      { service: "ベランダ", price: "6,000円～" },
    ],
  },
  {
    category: "エアコン掃除",
    items: [
      { service: "通常エアコンクリーニング", price: "12,000円～" },
      { service: "お掃除機能付きエアコン", price: "22,000円～" },
      { service: "ご家庭用埋込式エアコン", price: "25,000円～" },
      { service: "業務用4方向エアコン", price: "33,000円～" },
      { service: "室外機", price: "6,000円～" },
    ],
  },
  {
    category: "便利屋さんサービス",
    items: [
      { service: "害獣・害虫駆除", price: "10,000円～" },
      { service: "墓参り代行", price: "10,000円～" },
      { service: "ペットの世話（1回）", price: "3,000円～" },
      { service: "友達代行（1時間）", price: "5,000円～" },
      { service: "庭の手入れ", price: "8,000円～" },
      { service: "水道・トイレのつまり（軽度）", price: "7,000円～" },
      { service: "水道・トイレのつまり（中程度～重度）", price: "30,000円～" },
      { service: "水道・トイレのつまり（夜間対応）", price: "50,000円～" },
      { service: "その他", price: "要相談" },
    ],
  },
]

export default function BasicPriceList() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">基本料金表</h1>
      {services.map((category) => {
        const Icon = iconMap[category.category as keyof typeof iconMap]
        return (
          <Card key={category.category} className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                {Icon && <Icon className="mr-2" />}
                {category.category}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>サービス内容</TableHead>
                    <TableHead className="text-right">料金</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {category.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.service}</TableCell>
                      <TableCell className="text-right">{item.price}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )
      })}
      <p className="text-sm text-gray-600 mt-4">
        ※ 上記の料金は基本料金です。詳細な見積もりは、現地確認後に提供させていただきます。
        出張費が別途かかる場合があります。キャンペーンや割引が適用される場合があります。
      </p>
    </div>
  )
}
