import Link from "next/link"
import { Button } from "@/components/ui/button"
import Header from "../components/Header"

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-16 mt-20">
        <h1 className="text-4xl font-bold mb-8 text-center">プライバシーポリシー</h1>
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-lg">
          <p className="mb-4">
            クリーンコンフォート千葉（以下、「当社」）は、お客様の個人情報保護の重要性を深く認識し、以下のプライバシーポリシーを定め、個人情報の保護に努めます。
          </p>
          <h2 className="text-2xl font-semibold mb-4">1. 個人情報の収集・利用目的</h2>
          <p className="mb-4">当社は、以下の目的で個人情報を収集・利用いたします：</p>
          <ul className="list-disc list-inside mb-4">
            <li>ハウスクリーニング、エアコンクリーニング、便利屋サービスの提供</li>
            <li>サービスの予約、変更、キャンセルの管理</li>
            <li>料金の請求、支払い処理</li>
            <li>お客様からのお問い合わせ、苦情への対応</li>
            <li>サービス品質向上のためのアンケート実施</li>
            <li>新サービスや特典などの情報のご案内（お客様の同意がある場合のみ）</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4">2. 収集する個人情報の項目</h2>
          <p className="mb-4">当社が収集する個人情報は以下の項目です：</p>
          <ul className="list-disc list-inside mb-4">
            <li>氏名</li>
            <li>住所</li>
            <li>電話番号</li>
            <li>メールアドレス</li>
            <li>サービス利用履歴</li>
            <li>支払い情報（クレジットカード情報は保存しません）</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4">3. 個人情報の管理</h2>
          <p className="mb-4">
            当社は、お客様の個人情報を適切に管理し、紛失、破壊、改ざん、漏洩などを防ぐため、以下の安全管理措置を講じます：
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>個人情報へのアクセス制限と権限管理</li>
            <li>従業員に対する個人情報保護教育の実施</li>
            <li>個人情報を含む電子データの暗号化</li>
            <li>セキュリティソフトウェアの導入と定期的な更新</li>
            <li>物理的セキュリティ対策（施錠管理、入退室記録など）</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4">4. 個人情報の第三者提供</h2>
          <p className="mb-4">当社は、以下の場合を除き、お客様の同意なく個人情報を第三者に提供いたしません：</p>
          <ul className="list-disc list-inside mb-4">
            <li>法令に基づく場合</li>
            <li>人の生命、身体または財産の保護のために必要がある場合</li>
            <li>公衆衛生の向上または児童の健全な育成の推進のために特に必要がある場合</li>
            <li>
              国の機関もしくは地方公共団体またはその委託を受けた者が法令の定める事務を遂行することに対して協力する必要がある場合
            </li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4">5. 業務委託先への個人情報の提供</h2>
          <p className="mb-4">
            当社は、サービス提供や業務効率化のため、一部の業務を外部に委託することがあります。その際、業務委託先に個人情報を提供する場合がありますが、当社は委託先に対し、個人情報の適切な管理を求め、監督いたします。
          </p>
          <h2 className="text-2xl font-semibold mb-4">6. 個人情報の開示・訂正・削除</h2>
          <p className="mb-4">
            お客様ご本人からの個人情報の開示、訂正、削除のご要望があった場合、合理的な範囲で速やかに対応いたします。ただし、以下の場合は、ご要望にお応えできないことがあります：
          </p>
          <ul className="list-disc list-inside mb-4">
            <li>本人確認ができない場合</li>
            <li>法令に基づき開示が認められない場合</li>
            <li>当社の業務の適正な実施に著しい支障を及ぼすおそれがある場合</li>
          </ul>
          <h2 className="text-2xl font-semibold mb-4">7. クッキー（Cookie）の使用</h2>
          <p className="mb-4">
            当社のウェブサイトでは、お客様の利便性向上のためクッキーを使用することがあります。クッキーの使用を望まない場合は、ブラウザの設定で拒否することができます。ただし、一部のサービスが正常に機能しなくなる可能性があります。
          </p>
          <h2 className="text-2xl font-semibold mb-4">8. 未成年者の個人情報</h2>
          <p className="mb-4">
            当社は、未成年者の個人情報を収集する際、保護者の同意を得るよう努めます。保護者の方は、お子様の個人情報の取り扱いについてご不明な点がある場合、当社にお問い合わせください。
          </p>
          <h2 className="text-2xl font-semibold mb-4">9. プライバシーポリシーの変更</h2>
          <p className="mb-4">
            当社は、法令の変更や事業内容の変更等に応じて、本プライバシーポリシーを変更することがあります。変更後のプライバシーポリシーは、当ウェブサイトに掲載した時点から効力を生じるものとします。重要な変更がある場合は、当ウェブサイト上でお知らせいたします。
          </p>
          <h2 className="text-2xl font-semibold mb-4">10. お問い合わせ</h2>
          <p className="mb-4">本プライバシーポリシーに関するお問い合わせは、以下の連絡先までお願いいたします。</p>
          info@cleancomfort-chiba.com
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
