'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function TermsPage() {
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
            {lang === 'zh' ? '服务条款' : 'Terms of Service'}
          </h1>

          <div className="prose prose-lg dark:prose-invert max-w-none">
            {lang === 'zh' ? (
              <>
                <p className="text-muted-foreground mb-6">
                  最后更新日期：2026 年 4 月 12 日
                </p>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">1. 接受条款</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    欢迎使用 TheGuide Toolbox（以下简称"本服务"）。通过访问或使用本服务，您同意受本服务条款（以下简称"条款"）的约束。如果您不同意本条款的任何部分，请不要使用本服务。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">2. 服务描述</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    TheGuide Toolbox 是一个在线工具箱服务，提供包括但不限于以下功能：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>文件处理和转换工具</li>
                    <li>信息查询和展示功能</li>
                    <li>个性化设置和偏好保存</li>
                    <li>其他实用工具和功能</li>
                  </ul>
                  <p className="text-foreground/80 leading-relaxed">
                    我们保留随时修改、暂停或终止本服务（或其任何部分）的权利，恕不另行通知。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">3. 使用资格</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    本服务面向所有年龄段的用户设计。但是：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>如果您未满 13 周岁，请在父母或监护人的监督下使用本服务</li>
                    <li>您必须具有合法的权利和能力同意本条款</li>
                    <li>您不得使用本服务进行任何非法活动</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">4. 用户行为准则</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    在使用本服务时，您同意：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>不提供虚假、误导性或不准确的信息</li>
                    <li>不侵犯他人的知识产权或其他权利</li>
                    <li>不传播病毒、恶意代码或任何可能损害服务的技术手段</li>
                    <li>不尝试未经授权访问本服务或其系统</li>
                    <li>不使用本服务发送垃圾邮件或进行任何骚扰行为</li>
                    <li>遵守所有适用的法律法规</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">5. 知识产权</h2>
                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">5.1 我们的权利</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    本服务及其原始内容（包括但不限于代码、设计、图形、商标）的所有知识产权均归我们所有。本服务受版权、商标和其他知识产权法律的保护。
                  </p>

                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">5.2 您的权利</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    您保留您上传到本服务的任何内容的所有权。但是，您授予我们使用、存储和展示您内容的非独占许可，以便我们提供服务。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">6. 免责声明</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    本服务按"现状"和"可用"的基础提供，不作任何明示或暗示的保证，包括但不限于：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>服务将不间断、及时、安全或无错误</li>
                    <li>服务中的缺陷将被纠正</li>
                    <li>服务不包含病毒或其他有害组件</li>
                    <li>服务结果将准确或可靠</li>
                  </ul>
                  <p className="text-foreground/80 leading-relaxed">
                    您使用本服务的风险由您自行承担。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">7. 责任限制</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    在适用法律允许的最大范围内，我们对因使用或无法使用本服务而引起的任何间接的、附带的、特殊的、后果性的或惩罚性的损害不承担责任，包括但不限于：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>利润损失、数据丢失</li>
                    <li>业务中断或计算机故障</li>
                    <li>替代服务成本</li>
                    <li>任何其他金钱损失</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">8. 赔偿</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    您同意赔偿并使本服务、其所有者、关联公司、合作伙伴、员工和代理人免受因以下原因引起的任何索赔、损害、损失、责任、费用和开支（包括合理的律师费）：
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>您使用本服务</li>
                    <li>您违反本条款</li>
                    <li>您侵犯任何第三方权利</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">9. 服务修改和终止</h2>
                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">9.1 服务修改</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们保留随时修改或替换本服务任何部分的权利。任何变更、修改或删除都可能在通知您的情况下生效。
                  </p>

                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">9.2 账户终止</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们可以自行决定，因任何原因或无原因，随时终止或暂停您的访问权限，包括但不限于您违反本条款的行为。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">10. 第三方链接</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    本服务可能包含指向第三方网站或服务的链接。我们不对任何第三方网站或服务的内容、隐私政策或做法承担任何责任。您访问任何第三方网站的风险由您自行承担。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">11. 适用法律</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    本条款应受中华人民共和国法律管辖并按其解释，不考虑其法律冲突规定。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">12. 条款变更</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    我们保留随时修改本条款的权利。修改后的条款将在本页面发布，并在顶部标注最后更新日期。您继续使用本服务即表示您接受修改后的条款。
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">13. 联系方式</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    如果您对本条款有任何疑问，请通过以下方式联系我们：
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    电子邮件：legal@theguide-toolbox.com
                  </p>
                </section>
              </>
            ) : (
              <>
                <p className="text-muted-foreground mb-6">
                  Last Updated: April 12, 2026
                </p>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    Welcome to TheGuide Toolbox (hereinafter referred to as the "Service"). By accessing or using the Service, you agree to be bound by these Terms of Service (hereinafter referred to as the "Terms"). If you disagree with any part of these Terms, please do not use the Service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    TheGuide Toolbox is an online toolbox service that provides, including but not limited to, the following features:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>File processing and conversion tools</li>
                    <li>Information query and display functions</li>
                    <li>Personalized settings and preference saving</li>
                    <li>Other practical tools and features</li>
                  </ul>
                  <p className="text-foreground/80 leading-relaxed">
                    We reserve the right to modify, suspend, or terminate the Service (or any part thereof) at any time without prior notice.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Eligibility</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    The Service is designed for users of all ages. However:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>If you are under 13 years old, please use the Service under the supervision of a parent or guardian</li>
                    <li>You must have the legal right and capacity to agree to these Terms</li>
                    <li>You shall not use the Service for any illegal activities</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">4. User Conduct</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    When using the Service, you agree to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>Not provide false, misleading, or inaccurate information</li>
                    <li>Not infringe upon others' intellectual property rights or other rights</li>
                    <li>Not transmit viruses, malicious code, or any technical means that may harm the Service</li>
                    <li>Not attempt to access the Service or its systems without authorization</li>
                    <li>Not use the Service to send spam or engage in any harassing behavior</li>
                    <li>Comply with all applicable laws and regulations</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Intellectual Property</h2>
                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">5.1 Our Rights</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    All intellectual property rights in and to the Service and its original content (including but not limited to code, design, graphics, trademarks) are owned by us. The Service is protected by copyright, trademark, and other intellectual property laws.
                  </p>

                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">5.2 Your Rights</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    You retain ownership of any content you upload to the Service. However, you grant us a non-exclusive license to use, store, and display your content for the purpose of providing the Service.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">6. Disclaimer of Warranties</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    The Service is provided on an "as is" and "as available" basis, without any warranties of any kind, either express or implied, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>That the Service will be uninterrupted, timely, secure, or error-free</li>
                    <li>That defects in the Service will be corrected</li>
                    <li>That the Service is free of viruses or other harmful components</li>
                    <li>That the results of using the Service will be accurate or reliable</li>
                  </ul>
                  <p className="text-foreground/80 leading-relaxed">
                    Your use of the Service is at your sole risk.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">7. Limitation of Liability</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    To the maximum extent permitted by applicable law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from or in connection with the use or inability to use the Service, including but not limited to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>Loss of profits, data loss</li>
                    <li>Business interruption or computer failure</li>
                    <li>Cost of substitute services</li>
                    <li>Any other pecuniary loss</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Indemnification</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    You agree to indemnify and hold harmless the Service, its owners, affiliates, partners, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorney's fees) arising from:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-foreground/80 ml-4 mb-4">
                    <li>Your use of the Service</li>
                    <li>Your violation of these Terms</li>
                    <li>Your infringement of any third-party rights</li>
                  </ul>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">9. Modifications and Termination</h2>
                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">9.1 Service Modifications</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    We reserve the right to modify or replace any part of the Service at any time. Any changes, modifications, or replacements may take effect without notice to you.
                  </p>

                  <h3 className="text-xl font-medium mb-3 text-foreground mt-6">9.2 Termination</h3>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    We may terminate or suspend your access to the Service at our sole discretion, with or without cause, with or without notice, including but not limited to violations of these Terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Third-Party Links</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    The Service may contain links to third-party websites or services. We are not responsible for the content, privacy policies, or practices of any third-party websites or services. You access any third-party websites at your sole risk.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Governing Law</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    These Terms shall be governed by and construed in accordance with the laws of the People's Republic of China, without regard to its conflict of law provisions.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">12. Changes to Terms</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    We reserve the right to modify these Terms at any time. Modified Terms will be posted on this page with the last updated date at the top. Your continued use of the Service constitutes your acceptance of the modified Terms.
                  </p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4 text-foreground">13. Contact Information</h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    If you have any questions about these Terms, please contact us at:
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    Email: legal@theguide-toolbox.com
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
