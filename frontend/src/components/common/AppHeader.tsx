"use client";
import { routes } from "@/constants/routes";
import { IconLogin2 } from "@tabler/icons-react";
import { LogOut, Menu, X } from "lucide-react";
import React, { useEffect, useState } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RiArrowDropDownLine } from "react-icons/ri";
import { toast } from "sonner";
import logo from "../../assets/logo.webp";
import { Sheet, SheetContent } from "../ui/sheet";

const AppHeader = () => {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [openDrawer, setOpenDrawer] = useState(false);
  const [showFleetDropdown, setShowFleetDropdown] = useState(false);
  const [showServicesDropdown, setShowServicesDropdown] = useState(false);
  const router = useRouter();

  // Define links based on user authentication
  let links = [];
  const localStorage = typeof window !== "undefined" && window.localStorage;
  if (localStorage && localStorage?.getItem("adminToken")) {
    links = [
      { name: "Home", url: routes.home },
      { name: "My Bookings", url: routes.myBookings + "?page=0" },
      { name: "About Us", url: routes.about },
      { name: "Fleet" },
      { name: "Blogs", url: routes.adminBlogs },
      { name: "Our Services" },
      { name: "FAQs", url: routes.faqs },
      { name: "Contact Us", url: routes.contact },
    ];
  } else {
    // Links for non-admin users
    links = [
      { name: "Home", url: routes.home },
      { name: "Our Services" },
      { name: "My Bookings", url: routes.myBookings + "?page=0" },
      { name: "About Us", url: routes.about },
      { name: "Fleet" },
      { name: "Blogs", url: routes.blogs },
      { name: "FAQs", url: routes.faqs },
      { name: "Contact Us", url: routes.contact },
    ];
  }

  const handleFleetHover = () => {
    setShowFleetDropdown(true);
  };

  const handleFleetLeave = () => {
    setShowFleetDropdown(false);
  };

  const handleFleetClick = () => {
    setShowFleetDropdown((prevState) => !prevState);
  };

  const handleServicesHover = () => {
    setShowServicesDropdown(true);
  };

  const handleServicesLeave = () => {
    setShowServicesDropdown(false);
  };

  const handleServicesClick = () => {
    setShowServicesDropdown((prevState) => !prevState);
  };

  const handleItemClick = () => {
    setShowFleetDropdown(false);
    setShowServicesDropdown(false);
    setOpenDrawer(false);
  };

  const LoginLogoutSystem = () =>
    localStorage &&
    (localStorage?.getItem("user") || localStorage?.getItem("admin")) ? (
      <div className="flex items-center gap-2 text-primary-foreground">
        <p className="hidden md:block">
          Hi,{" "}
          {JSON.parse(localStorage?.getItem("user") as string)?.firstname ||
            JSON.parse(localStorage?.getItem("admin") as string)?.username}
        </p>
        <LogOut
          className="cursor-pointer"
          onClick={() => {
            const isAdmin = localStorage?.getItem("admin");
            localStorage?.removeItem("user");
            localStorage?.removeItem("authToken");
            localStorage?.removeItem("adminToken");
            localStorage?.removeItem("admin");
            toast.success("Logged Out", {});
            router.push(isAdmin ? routes.loginAdmin : routes.login);
          }}
        />
      </div>
    ) : (
      <div className="flex items-center space-x-2  text-primary-foreground">
        <IconLogin2
          stroke={1.5}
          size={24}
          className="text-primary-foreground cursor-pointer"
          onClick={() => {
            router.push(routes.login);
          }}
        />
        <Link className="text-md font-medium max-lg:hidden" href="/login">
          Sign In
        </Link>
        <div className="h-5 w-0.5 bg-primary-foreground max-lg:hidden"></div>
        <Link href="/signup" className="text-md font-medium max-lg:hidden">
          Sign Up
        </Link>
      </div>
    );

  return (
    <div className="w-full h-20 flex bg-secondary shadow-lg">
      <div className="container flex justify-between items-center">
        <div className="flex items-center space-x-20">
          <img 
            src={logo.src}
            alt="Royal Limo Co Logo"
            title="Royal Limo Co Logo"
            className="cursor-pointer"
            onClick={() => {
              router.push(routes.home);
            }}
          />
          <div className="flex items-center space-x-8 max-lg:hidden">
            {isClient &&
              links.map((link, index) => (
                <div key={index}>
                  {/* Conditional rendering for Fleet link   */}
                  {link.name === "Fleet" && (
                    <div
                      className="relative"
                      onMouseEnter={handleFleetHover}
                      onMouseLeave={handleFleetLeave}
                      onClick={handleFleetClick}
                    >
                      <div className="flex items-center">
                        <Link
                          href={link.url || "#"}
                          className={`text-md font-normal text-primary-foreground hover:text-primary transition duration-300 ease-in-out ${
                            link.url?.split("?")[0] === pathname
                              ? "border-b-2"
                              : ""
                          }`}
                          style={{
                            color:
                              link.url?.split("?")[0] === pathname
                                ? "#CA9923"
                                : "",
                          }}
                        >
                          {link.name}
                        </Link>
                        {/* Flex container for the fleet icon */}
                        <div className="flex items-center space-x-8 max-lg:hidden">
                          <RiArrowDropDownLine
                            style={{
                              color: "white",
                              fontSize: "clamp(20px, 5vw, 25px)",
                            }}
                          />
                        </div>
                      </div>

                      {/* Fleet dropdown  */}
                      {showFleetDropdown && (
                        <div className="absolute top-full left-[-50px] w-[220px] bg-white shadow-lg rounded-lg p-5 zIndex-[2000] max-lg:hidden">
                          <ul className="m-2.5 space-y-6">
                            <li>
                              <Link
                                className="hover:text-primary transition duration-300 ease-in-out max-lg:hidden"
                                href={routes.cadillacEscalade}
                              >
                                Cadillac Escalade
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="hover:text-primary transition duration-300 ease-in-out max-lg:hidden"
                                href={routes.gmcYukon}
                              >
                                GMC Yukon
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="hover:text-primary transition duration-300 ease-in-out max-lg:hidden"
                                href={routes.suburban}
                              >
                                Suburban
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="hover:text-primary transition duration-300 ease-in-out max-lg:hidden"
                                href={routes.blackSedan}
                              >
                                Black Sedan
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {link.name === "Our Services" && (
                    <div
                      className="relative"
                      onMouseEnter={handleServicesHover}
                      onMouseLeave={handleServicesLeave}
                      onClick={handleServicesClick}
                    >
                      <div className="flex items-center">
                        <Link
                          href={link.url || "#"}
                          className={`text-md font-normal text-primary-foreground hover:text-primary transition duration-300 ease-in-out ${
                            link.url?.split("?")[0] === pathname
                              ? "border-b-2"
                              : ""
                          }`}
                          style={{
                            color:
                              link.url?.split("?")[0] === pathname
                                ? "#CA9923"
                                : "",
                          }}
                        >
                          {link.name}
                        </Link>
                        <div className="flex items-center space-x-8 max-lg:hidden">
                          <RiArrowDropDownLine
                            style={{
                              color: "white",
                              fontSize: "clamp(20px, 5vw, 25px)",
                            }}
                          />
                        </div>
                      </div>
                      {showServicesDropdown && (
                        <div className="absolute top-full left-[-50px] w-[270px] bg-white shadow-lg rounded-lg p-5 zIndex-[2000] max-lg:hidden">
                          <ul className="m-2.5 space-y-6 text-base">
                            <li>
                              <Link
                                className="hover:text-primary transition duration-300 ease-in-out max-lg:hidden"
                                href={routes.airport}
                              >
                                Airport Transportation
                              </Link>
                            </li>
                            <li>
                              <Link
                                className="hover:text-primary transition duration-300 ease-in-out max-lg:hidden"
                                href={routes.wedding}
                              >
                                Wedding Transportation
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="hover:text-primary transition duration-300 ease-in-out max-lg:hidden"
                                href={routes.corporate}
                              >
                                Corporate Transportation
                              </Link>
                            </li>

                            <li>
                              <Link
                                className="hover:text-primary transition duration-300 ease-in-out max-lg:hidden"
                                href={routes.special}
                              >
                                Special Events
                              </Link>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {link.name !== "Fleet" && link.name !== "Our Services" && (
                    <Link
                      href={link.url || "#"}
                      className={`text-md font-normal text-primary-foreground hover:text-primary transition duration-300 ease-in-out ${
                        link.url?.split("?")[0] === pathname ? "border-b-2" : ""
                      }`}
                      style={{
                        color:
                          link.url?.split("?")[0] === pathname ? "#CA9923" : "",
                      }}
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
          </div>
        </div>
        <div className="max-lg:flex gap-4 ">
          {isClient && <LoginLogoutSystem />}
          <div className="lg:hidden">
            {openDrawer ? (
              <X
                onClick={() => setOpenDrawer(false)}
                className="cursor-pinter"
                color="white"
                size={24}
              />
            ) : (
              <Menu
                onClick={() => setOpenDrawer(true)}
                color="white"
                className="cursor-pinter"
                size={24}
              />
            )}
          </div>
          <Sheet
            open={openDrawer}
            onOpenChange={() => {
              setOpenDrawer(!openDrawer);
            }}
            key={"right"}
          >
            <SheetContent
              side={"left"}
              className="bg-primary w-60 h-full "
              style={{
                zIndex: 1000,
              }}
            >
              <div className="flex flex-col overflow-visible">
                {isClient &&
                  links.map((link, index) => (
                    <React.Fragment key={index}>
                      {link.name !== "Fleet" && link.name !== "Our Services" ? (
                        <Link
                          key={index}
                          href={link.url || "/"}
                          className={`text-md font-normal text-primary-foreground hover:text-primary transition duration-300 ease-in-out my-3`}
                          style={{
                            color:
                              link.url?.split("?")[0] === pathname
                                ? "#CA9923"
                                : "",
                          }}
                          onClick={() => {
                            setOpenDrawer(false);
                          }}
                        >
                          {link.name}
                        </Link>
                      ) : (
                        <>
                          {link.name === "Fleet" && (
                            <div className="sidebar-dropdown" key={index}>
                              <div
                                className="sidebar-dropdown-header flex items-center"
                                onClick={handleFleetClick}
                              >
                                <span className="text-white hover:text-primary transition duration-300 ease-in-out">
                                  Fleet
                                </span>
                                <RiArrowDropDownLine className="dropdown-icon flex text-white right-5" />
                              </div>
                              {showFleetDropdown ? (
                                <div className="sidebar-dropdown-content flex justify-center rounded-lg bg-white shadow-lg m-2 border-2 rounded">
                                  <ul>
                                    <li className="m-2.5 hover:text-primary transition duration-300 ease-in-out">
                                      <button
                                        onClick={() => {
                                          router.push(routes.cadillacEscalade);
                                          handleItemClick();
                                        }}
                                      >
                                        Cadillac Escalade
                                      </button>
                                    </li>
                                    <li className="m-2.5 hover:text-primary transition duration-300 ease-in-out">
                                      <button
                                        onClick={() => {
                                          router.push(routes.gmcYukon);
                                          handleItemClick();
                                        }}
                                      >
                                        GMC Yukon
                                      </button>
                                    </li>
                                    <li className="m-2.5 hover:text-primary transition duration-300 ease-in-out">
                                      <button
                                        onClick={() => {
                                          router.push(routes.suburban);
                                          handleItemClick();
                                        }}
                                      >
                                        Suburban
                                      </button>
                                    </li>
                                    <li className="m-2.5 mb-3 hover:text-primary transition duration-300 ease-in-out">
                                      <button
                                        onClick={() => {
                                          router.push(routes.blackSedan);
                                          handleItemClick();
                                        }}
                                      >
                                        Black Sedan
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          )}

                          {link.name === "Our Services" && (
                            <div className="sidebar-dropdown" key={index}>
                              <div
                                className="sidebar-dropdown-header flex items-center"
                                onClick={handleServicesClick}
                              >
                                <span className="text-white hover:text-primary transition duration-300 ease-in-out">
                                  Our Services
                                </span>
                                <RiArrowDropDownLine className="dropdown-icon flex text-white right-5" />
                              </div>
                              {showServicesDropdown ? (
                                <div className="sidebar-dropdown-content flex justify-center rounded-lg bg-white shadow-lg m-2 border-2 text-center">
                                  <ul>
                                    <li className="m-2.5 hover:text-primary transition duration-300 ease-in-out">
                                      <button
                                        onClick={() => {
                                          router.push(routes.airport);
                                          handleItemClick();
                                        }}
                                      >
                                        Airport Transportation
                                      </button>
                                    </li>
                                    <li className="m-2.5 hover:text-primary transition duration-300 ease-in-out">
                                      <button
                                        onClick={() => {
                                          router.push(routes.wedding);
                                          handleItemClick();
                                        }}
                                      >
                                        Wedding Transportation
                                      </button>
                                    </li>
                                    <li className="m-2.5 hover:text-primary transition duration-300 ease-in-out">
                                      <button
                                        onClick={() => {
                                          router.push(routes.corporate);
                                          handleItemClick();
                                        }}
                                      >
                                        Corporate Transportation
                                      </button>
                                    </li>
                                    <li className="m-2.5 mb-3 hover:text-primary transition duration-300 ease-in-out">
                                      <button
                                        onClick={() => {
                                          router.push(routes.special);
                                          handleItemClick();
                                        }}
                                      >
                                        Special Events
                                      </button>
                                    </li>
                                  </ul>
                                </div>
                              ) : null}
                            </div>
                          )}
                        </>
                      )}
                    </React.Fragment>
                  ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
};

export default AppHeader;
