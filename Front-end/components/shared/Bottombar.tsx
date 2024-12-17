"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sidebarLinks } from "@/constants";
import useTriggerStore from "@/store/useTriggerStore";

function Bottombar() {
  const { toggleTrigger } = useTriggerStore();
  const pathname = usePathname();
  return (
    <section className="fixed bottom-0 z-10 w-full rounded-t-3xl bg-light-2 p-4 backdrop-blur-lg dark:bg-glassmorphism xs:px-7 md:hidden">
      <div className="flex items-center justify-between gap-3 xs:gap-5">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.route ||
            (pathname.includes(link.route) && link.route.length > 1);
          const isCreateThread = link.route === "/create-thread";
          const handleClick = () => {
            if (isCreateThread) toggleTrigger("isCreateThreadCardOpened");
          };

          return (
            <Link
              onClick={handleClick}
              href={isCreateThread ? "#" : link.route}
              key={link.label}
              className={`relative flex flex-col items-center gap-2 rounded-lg p-2 sm:flex-1 sm:px-2 sm:py-2.5 ${isActive ? "bg-light-5 dark:bg-primary-500" : ""}`}
            >
              <Image
                src={link.imgURL}
                alt={link.label}
                width={16}
                height={16}
                className="object-contain"
              />
              <p className="dark:text-light-1 max-sm:hidden">
                {link.label.split(/\s+/)[0]}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default Bottombar;
