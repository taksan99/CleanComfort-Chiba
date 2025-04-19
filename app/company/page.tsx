import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "../components/Header"

export default function CompanyPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-16 mt-20">
        <h1 className="text-4xl font-bold mb-8 text-center">会社概要</h1>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">クリーンコンフォート千葉について</h2>
          <p className="mb-4">
            クリーンコンフォート千葉は、お客様の日常生活に清潔さと快適さをお届けすることを使命とする、地域密着型のクリーニングサービス企業です。私たちは、新しく生まれたJI-TECHグループの一員として、高品質なサービスと顧客満足を追求しています。
          </p>
          <h3 className="text-xl font-semibold mb-2">事業内容</h3>
          <ul className="list-disc list-inside mb-4">
            <li>ハウスクリーニング（水回り、キッチン、浴室、トイレなど）</li>
            <li>エアコンクリーニング（家庭用、業務用）</li>
            <li>便利屋サービス（害獣・害虫駆除、庭の手入れ、その他日常のお困りごと解決）</li>
            <li>定期的な清掃サービス（サブスクリプションプラン）</li>
          </ul>
          <h3 className="text-xl font-semibold mb-2">企業理念</h3>
          <p className="mb-4">
            「お客様の生活に、清潔と快適さを」をモットーに、プロフェッショナルな技術と心のこもったサービスで、お客様の生活空間を美しく保ち、快適な暮らしをサポートします。
          </p>
          <h3 className="text-xl font-semibold mb-2">会社情報</h3>
          <p className="mb-4">
            社名: クリーンコンフォート千葉
            <br />
            所在地: 〒298-0135 千葉県いすみ市作田556
            <br />
            電話番号: 090-3888-4717
          </p>
          <p className="mb-2">代表者: 塚越 貴之</p>
          <h3 className="text-xl font-semibold mb-2">お問い合わせについて</h3>
          <p className="mb-4">
            クリーンコンフォート千葉に直接ご連絡がつかない場合は、以下の連絡先までお問い合わせください。
          </p>
          <p className="mb-4">
            JI-TECH 株式会社
            <br />
            所在地: 〒297-0029 千葉県茂原市押日417-6
            <br />
            電話番号: 0475-36-3257
          </p>
          <p className="mb-4">
            株式会社 和煌
            <br />
            所在地: 〒299-1106 千葉県君津市中島1142-4
            <br />
            （担当：和田）
            <br />
            電話番号: 090-2306-4702
            <br />
            （担当：山本）
            <br />
            電話番号: 080-6505-0685
          </p>
          <p className="mb-4">
            株式会社 菅和
            <br />
            所在地: 〒299-0111 千葉県市原市姉崎1943-5
            <br />
            （担当：土屋）
            <br />
            電話番号: 090-4413-6307
          </p>
          <h3 className="text-xl font-semibold mb-2">私たちの強み</h3>
          <ul className="list-disc list-inside mb-4">
            <li>地域密着型のきめ細やかなサービス</li>
            <li>経験豊富なスタッフによる高品質な清掃</li>
            <li>環境に配慮した洗剤と最新の清掃技術の使用</li>
            <li>柔軟な対応と幅広いサービスメニュー</li>
          </ul>
          <p className="mb-4">
            クリーンコンフォート千葉は、お客様の信頼と満足を第一に考え、常に最高品質のサービスを提供することをお約束します。私たちは、お客様の生活に寄り添い、快適で清潔な空間づくりをサポートし続けます。
          </p>
        </div>
        <div className="text-center mt-8">
          <Link href="/">
            <Button>トップページに戻る</Button>
          </Link>
        </div>
      </div>
    </>
  )
}
