"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FAQAccordion() {
  const [active, setActive] = useState<number | null>(null);

  const faqs = [
    {
      id: 1,
      question: "Kenapa nggak nambah persen biasa aja?",
      answer: (
        <span>
          Karena marketplace motong duit dari <strong>Harga Jual</strong>, bukan Modal! Kalau cuma tambah persen ke modal, margin aslimu bakal kemakan sistem.
        </span>
      ),
      bgColor: "bg-brutalYellow/30",
      hoverBg: "hover:bg-brutalYellow/40",
    },
    {
      id: 2,
      question: "Tools ini aman kan?",
      answer: "Super aman! Kalkulasi berjalan 100% di browser kamu. Kami nggak simpan data rahasia soal harga produk dan cuan kamu.",
      bgColor: "bg-brutalPurple/30",
      hoverBg: "hover:bg-brutalPurple/40",
    },
  ];

  return (
    <div className="w-full space-y-4">
      {faqs.map((faq) => {
        const isOpen = active === faq.id;
        return (
          <div key={faq.id} className="border-2 border-darkText rounded-2xl bg-white overflow-hidden shadow-brutal">
            <button
              onClick={() => setActive(isOpen ? null : faq.id)}
              className={`flex w-full items-center justify-between p-5 font-extrabold text-base md:text-lg text-left transition-colors ${faq.bgColor} ${faq.hoverBg} text-darkText cursor-pointer`}
            >
              <span>{faq.question}</span>
              <div className="p-1 border-2 border-darkText rounded-md bg-white">
                <ChevronDown className={`h-5 w-5 transition-transform duration-300 text-darkText ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>
            {isOpen && (
              <div className="p-5 border-t-2 border-darkText font-semibold text-darkText/80 leading-relaxed bg-white text-sm md:text-base">
                {faq.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
