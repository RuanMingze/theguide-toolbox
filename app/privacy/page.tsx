'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PrivacyPage() {
  const [lang, setLang] = useState<'zh' | 'en'>('zh')

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* 导航栏 */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
            {lang === 'zh' ? '返回主页' : 'Back to Home'}
          </Link>
          <button
            onClick={() => setLang(lang === 'zh' ? 'en' : 'zh')}
            className="px-4 py-2 text-sm rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            {lang === 'zh' ? 'English' : '中文'}
          </button>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-foreground">
            {lang === 'zh' ? '隐私政策' : 'Privacy Policy'}
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {lang === 'zh' ? (
              <>
                <p className="text-muted-foreground mb-6">
                  最后更新日期：2026 年 4 月 12 日
                </p>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">1. 引言</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    欢迎使用 TheGuide Toolbox（以下简称"我们"或"我们的服务"）。我们非常重视您的隐私权和个人信息保护。本隐私政策旨在向您说明，在使用我们的服务时，我们如何收集、使用、存储和保护您的个人信息。
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    请您在使用我们的服务前，仔细阅读并了解本隐私政策。一旦您开始使用我们的服务，即表示您已充分理解并同意本政策。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">2. 我们收集的信息</h2>
                  
                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">2.1 我们不收集的信息</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们承诺**不收集**以下类型的个人信息：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>姓名、电话号码、电子邮件地址等联系方式</li>
                    <li>身份证号码、护照号码等身份证明文件</li>
                    <li>银行账户、信用卡号等财务信息</li>
                    <li>精确的地理位置信息</li>
                    <li>生物识别信息</li>
                  </ul>

                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">2.2 我们可能收集的技术信息</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    为了提供更好的服务和优化用户体验，我们可能会自动收集以下技术信息：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li><strong>设备信息：</strong>设备类型、操作系统、浏览器类型和版本</li>
                    <li><strong>使用数据：</strong>页面访问记录、功能使用情况、错误日志</li>
                    <li><strong>IP 地址：</strong>用于提供地理位置相关的服务（如天气信息）</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">3. 信息的使用方式</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们可能将收集的信息用于以下目的：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>提供、维护和改进我们的服务</li>
                    <li>开发新的功能和工具</li>
                    <li>诊断技术问题并解决错误</li>
                    <li>分析使用趋势以优化用户体验</li>
                    <li>确保服务的安全性和完整性</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">4. 信息共享与披露</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们**不会**向第三方出售、出租或交易您的个人信息。但在以下情况下，我们可能会披露信息：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li><strong>服务提供商：</strong>与我们信任的第三方服务提供商共享，以帮助我们运营服务（如托管服务）</li>
                    <li><strong>法律要求：</strong>当法律要求或为了保护我们的权利时</li>
                    <li><strong>业务转移：</strong>在合并、收购或资产出售的情况下</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">5. 数据存储与安全</h2>
                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">5.1 数据存储</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    您的数据可能存储在我们选择的云服务提供商的服务器上。我们会采取合理措施确保数据存储的安全性。
                  </p>

                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">5.2 安全措施</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们实施了适当的技术和组织措施来保护您的信息：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>数据传输加密（HTTPS/SSL）</li>
                    <li>访问控制和身份验证</li>
                    <li>定期的安全审计和更新</li>
                    <li>员工隐私保护培训</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Cookie 和类似技术</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们使用 Cookie 和类似技术来提升用户体验：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li><strong>必要 Cookie：</strong>用于网站基本功能</li>
                    <li><strong>偏好 Cookie：</strong>记住您的设置和偏好</li>
                    <li><strong>分析 Cookie：</strong>帮助我们了解网站使用情况</li>
                  </ul>
                  <p className="text-foreground/80 leading-relaxed">
                    您可以通过浏览器设置管理或禁用 Cookie，但这可能会影响某些功能的正常使用。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">7. 儿童隐私</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们的服务面向所有年龄段的用户。我们不会故意收集 13 岁以下儿童的个人信息。如果我们发现收集了儿童的个人信息，我们会立即删除。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">8. 您的权利</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    根据适用的数据保护法律，您可能拥有以下权利：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>访问您的个人信息</li>
                    <li>更正不准确的个人信息</li>
                    <li>删除您的个人信息</li>
                    <li>限制或反对某些处理</li>
                    <li>数据可携带性</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">9. 隐私政策的变更</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们可能会不时更新本隐私政策。更新后的政策将在本页面上发布，并在顶部标注最后更新日期。我们建议您定期查看本页面以了解任何变更。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">10. 联系我们</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    如果您对本隐私政策有任何疑问、意见或投诉，请通过以下方式联系我们：
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    电子邮件：privacy@theguide-toolbox.com
                  </p>
                </section>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-6">
                  Last Updated: April 12, 2026
                </p>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    Welcome to TheGuide Toolbox (hereinafter referred to as "we", "us", or "our service"). We highly value your privacy and personal information protection. This Privacy Policy aims to explain how we collect, use, store, and protect your personal information when you use our services.
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    Please read and understand this Privacy Policy carefully before using our services. By using our services, you acknowledge that you have fully understood and agreed to this policy.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
                  
                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">2.1 Information We DO NOT Collect</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    We commit to **NOT collecting** the following types of personal information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>Contact information such as name, phone number, email address</li>
                    <li>Identity documents such as ID card numbers, passport numbers</li>
                    <li>Financial information such as bank accounts, credit card numbers</li>
                    <li>Precise geographic location information</li>
                    <li>Biometric information</li>
                  </ul>

                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">2.2 Technical Information We May Collect</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    To provide better services and optimize user experience, we may automatically collect the following technical information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li><strong>Device Information:</strong> Device type, operating system, browser type and version</li>
                    <li><strong>Usage Data:</strong> Page access records, feature usage, error logs</li>
                    <li><strong>IP Address:</strong> Used to provide location-related services (such as weather information)</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Information</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    We may use the collected information for the following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>To provide, maintain, and improve our services</li>
                    <li>To develop new features and tools</li>
                    <li>To diagnose technical issues and resolve errors</li>
                    <li>To analyze usage trends to optimize user experience</li>
                    <li>To ensure the security and integrity of our services</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Information Sharing and Disclosure</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    We do **NOT** sell, rent, or trade your personal information to third parties. However, we may disclose information in the following circumstances:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li><strong>Service Providers:</strong> Shared with trusted third-party service providers to help us operate our services (such as hosting services)</li>
                    <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                    <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or asset sale</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Data Storage and Security</h2>
                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">5.1 Data Storage</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    Your data may be stored on servers of cloud service providers we have selected. We take reasonable measures to ensure the security of data storage.
                  </p>

                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">5.2 Security Measures</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    We implement appropriate technical and organizational measures to protect your information:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>Data transmission encryption (HTTPS/SSL)</li>
                    <li>Access control and authentication</li>
                    <li>Regular security audits and updates</li>
                    <li>Employee privacy protection training</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Cookies and Similar Technologies</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    We use cookies and similar technologies to enhance user experience:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li><strong>Necessary Cookies:</strong> For basic website functionality</li>
                    <li><strong>Preference Cookies:</strong> To remember your settings and preferences</li>
                    <li><strong>Analytics Cookies:</strong> To help us understand website usage</li>
                  </ul>
                  <p className="text-foreground/80 leading-relaxed">
                    You can manage or disable cookies through your browser settings, but this may affect the normal use of certain features.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Children's Privacy</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    Our services are designed for users of all ages. We do not knowingly collect personal information from children under 13. If we discover that we have collected personal information from a child, we will delete it immediately.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Your Rights</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    Under applicable data protection laws, you may have the following rights:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>Access to your personal information</li>
                    <li>Correction of inaccurate personal information</li>
                    <li>Deletion of your personal information</li>
                    <li>Restriction or objection to certain processing</li>
                    <li>Data portability</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Changes to This Privacy Policy</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    We may update this Privacy Policy from time to time. Updated policies will be posted on this page with the last updated date at the top. We recommend that you check this page periodically for any changes.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Contact Us</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    If you have any questions, comments, or complaints about this Privacy Policy, please contact us at:
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    Email: privacy@theguide-toolbox.com
                  </p>
                </section>
              </>
            )}
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="border-t bg-muted/30 mt-12">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground">
          <p className="text-sm">
            © 2026 TheGuide Toolbox. {lang === 'zh' ? '保留所有权利。' : 'All rights reserved.'}
          </p>
        </div>
      </footer>
    </div>
  )
}
