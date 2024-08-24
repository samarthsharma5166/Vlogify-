import React from "react";
import { Footer } from "flowbite-react";
import { Link } from "react-router-dom";
import { BsGithub, BsInstagram, BsLinkedin } from "react-icons/bs";
const FooterCom = () => {
  return (
    <Footer className="border border-t-8 border-teal-500">
      <div className="w-full max-w-7xl mx-auto py-3">
        <div className="grid w-full justify-between sm:flex md:grid-cols-1 ">
          <div className="mt-5">
            <Link
              to="/"
              className="self-center whitespace-nowrap text-lg sm:text-xl font-semibold dark:text-white hover:scale-95 transition-all"
            >
              <span className="px-3 py-1.5 bg-gradient-to-r from-[#00c6ff] to-[#0072ff] rounded-2xl text-white ">
                Vlogify!
              </span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-8 mt-4 sm:grid-cols-3 sm:gap-6">
            <div>
              <Footer.Title title="About" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://samarthsharma5166.netlify.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Samarth Sharma
                </Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link
                  href="/about"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Vlogify!
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="follow us" />
              <Footer.LinkGroup col>
                <Footer.Link
                  href="https://github.com/samarthsharma5166"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Github
                </Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link href="#">Discord</Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="legal" />
              <Footer.LinkGroup col>
                <Footer.Link href="#">Privacy Policy</Footer.Link>
              </Footer.LinkGroup>
              <Footer.LinkGroup col>
                <Footer.Link href="#">Terms &amp; Conditions</Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <Footer.Copyright
            href="#"
            by="Samarth Sharma"
            year={new Date().getFullYear()}
          />
          <div className="flex gap-6 mt-4 sm:mt-0 sm:justify-center">
            <Footer.Icon href="https://github.com/samarthsharma5166" icon={BsGithub} target="_blank"/>
            <Footer.Icon href="https://www.instagram.com/samarth_sharma__5166?igsh=aHBzbmpnZGlndngz" icon={BsInstagram} target="_blank"/>
            <Footer.Icon href="https://www.linkedin.com/in/samarth-sharma-bbbb0221b" icon={BsLinkedin} target="_blank"/>
          </div>
        </div>
      </div>
    </Footer>
  );
};

export default FooterCom;
