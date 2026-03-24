import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="mb-3 font-medium">Sections</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">World</a></li>
              <li><a href="#" className="hover:text-foreground">Politics</a></li>
              <li><a href="#" className="hover:text-foreground">Business</a></li>
              <li><a href="#" className="hover:text-foreground">Technology</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-medium">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">About Us</a></li>
              <li><a href="#" className="hover:text-foreground">Contact</a></li>
              <li><a href="#" className="hover:text-foreground">Careers</a></li>
              <li><a href="#" className="hover:text-foreground">Advertise</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-medium">Help</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">FAQ</a></li>
              <li><a href="#" className="hover:text-foreground">Subscribe</a></li>
              <li><a href="#" className="hover:text-foreground">Newsletter</a></li>
              <li><a href="#" className="hover:text-foreground">Support</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 font-medium">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-foreground">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="text-sm text-muted-foreground text-center pt-8 border-t border-border">
          © 2026 The Chronicle. All rights reserved.
        </div>
      </div>
    </footer>
  );
}