"use client"

import { Mail, Phone, ArrowRight, Github, Linkedin, Twitter, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg" />
                <h3 className="text-lg font-bold text-gray-900">DCTFUSION</h3>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                Transforming education with secure biometric enrollment and smart student management systems.
              </p>
            </div>
            <div className="flex gap-3 pt-4">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4 text-gray-700 hover:text-blue-600" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4 text-gray-700 hover:text-blue-600" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4 text-gray-700 hover:text-blue-600" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-blue-100 flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4 text-gray-700 hover:text-blue-600" />
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Product</h4>
            <ul className="space-y-2.5">
              {["Features", "Security", "Pricing", "Integration", "API Docs"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Resources</h4>
            <ul className="space-y-2.5">
              {["Documentation", "Guides", "Blog", "Support", "Community"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2"
                  >
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                    <span className="group-hover:translate-x-1 transition-transform">{item}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact CTA */}
          <div className="space-y-4" id="contact">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Get in Touch</h4>
            <div className="space-y-3">
              <a
                href="tel:+265998970102"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
              >
                <Phone className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                <span className="text-sm text-gray-700">+265998970102</span>
              </a>
              <a
                href="mailto:ebs21-mtsaka@mubas.ac.mw"
                className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-blue-50 transition-colors group"
              >
                <Mail className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                <span className="text-sm text-gray-700">ebs21-mtsaka@mubas.ac.mw</span>
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-gray-200 via-gray-200 to-transparent mb-8" />

        {/* Newsletter & Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-gray-900">Subscribe to Updates</h4>
            <p className="text-sm text-gray-600">
              Get the latest features and security updates delivered to your inbox.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6">
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Students", value: "9K+" },
              { label: "Schools", value: "10+" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-gray-200"
              >
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-gray-200">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>© {currentYear} DCTFUSION. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Cookie Settings
            </a>
          </div>
        </div>
      </div>

      {/* Accent Line */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />
    </footer>
  )
}
