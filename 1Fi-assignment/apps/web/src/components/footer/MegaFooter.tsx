import {
  footerCategoryGroups,
  companyInfo,
  quickLinks,
  supportLinks,
  socialLinks,
} from "@/data/site"

export function MegaFooter() {
  return (
    <footer className="mt-12 border-t bg-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Category link columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {footerCategoryGroups.map((group) => (
            <div key={group.heading}>
              <h4 className="font-bold text-sm text-foreground mb-3">{group.heading}</h4>
              <ul className="space-y-2">
                {group.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs text-muted-foreground hover:text-accent-purple">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Business banner */}
        <div className="border-t py-4 mb-6">
          <a href="#" className="text-sm font-semibold text-accent-purple hover:underline">
            1Fi for Business →
          </a>
        </div>

        {/* Company info */}
        <div className="mb-6 text-sm text-muted-foreground">
          <p className="font-bold text-foreground">{companyInfo.legalName}</p>
          <p>{companyInfo.address}</p>
          <p>{companyInfo.phone} • {companyInfo.hours}</p>
        </div>

        {/* Quick links + Support links */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-accent-purple">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-foreground mb-3">Support Links</h4>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link}>
                  <a href="#" className="text-xs text-muted-foreground hover:text-accent-purple">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App download row */}
        <div className="border-t pt-6 mb-6">
          <h4 className="font-bold text-sm text-foreground mb-3">Download 1Fi Today</h4>
          <div className="flex gap-3">
            <a href="#" className="inline-flex items-center gap-2 rounded-full bg-foreground/90 px-4 py-2 text-xs text-background hover:bg-foreground transition-colors">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.18 23.77c-.35-.18-.62-.5-.62-.93V.16c0-.43.27-.75.62-.93l.13-.06 10.3 5.95-10.43 18.65zm18.2-9.96l-3.56-2.06-3.56 2.06 3.56 2.06 3.56-2.06zm-3.56-7.65l3.56-2.06-3.56-2.06-3.56 2.06 3.56 2.06zM.62.16C.27-.02 0 .29 0 .72v22.56c0 .43.27.74.62.93l.13.06L11.18 12 2.3.16l-.13.06z" />
              </svg>
              Google Play
            </a>
            <a href="#" className="inline-flex items-center gap-2 rounded-full bg-foreground/90 px-4 py-2 text-xs text-background hover:bg-foreground transition-colors">
              <svg className="size-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
              App Store
            </a>
          </div>
        </div>

        {/* Social icons */}
        <div className="flex gap-4 mb-6">
          <a href={socialLinks.facebook} className="size-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent-purple hover:text-white transition-colors">
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
          </a>
          <a href={socialLinks.instagram} className="size-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent-purple hover:text-white transition-colors">
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
          </a>
          <a href={socialLinks.twitter} className="size-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent-purple hover:text-white transition-colors">
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </a>
          <a href={socialLinks.youtube} className="size-8 rounded-full bg-muted flex items-center justify-center hover:bg-accent-purple hover:text-white transition-colors">
            <svg className="size-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
          </a>
        </div>

        {/* Tagline */}
        <p className="text-center text-xs text-muted-foreground">Proudly made in India</p>
      </div>
    </footer>
  )
}
