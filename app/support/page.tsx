import { Metadata } from "next";
import { Mail, Building } from "lucide-react";

export const metadata: Metadata = {
    title: "Служба поддержки - DocFinder",
    description: "Контактная информация службы поддержки DocFinder",
};

export default function SupportPage() {
    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="h2-40-56-600 text-foreground mb-4">
                        Служба поддержки
                    </h1>
                    <p className="h4-20-28-600 text-muted-foreground">
                        Контакты для обращений
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {/* Email */}
                    <div className="bg-card rounded-lg shadow-sm p-8 text-center">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Mail className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="h4-20-28-600 text-foreground mb-3">
                            Электронная почта
                        </h3>
                        <a
                            href="mailto:info@docfinder.kz"
                            className="text-primary hover:text-primary/80 h4-20-24-600"
                        >
                            info@docfinder.kz
                        </a>
                    </div>

                    {/* Оператор */}
                    <div className="bg-card rounded-lg shadow-sm p-8 text-center">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Building className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="h4-20-28-600 text-foreground mb-3">
                            Оператор
                        </h3>
                        <div className="text-muted-foreground space-y-1">
                            <p className="h4-20-24-600 text-foreground">ТОО «Medical Development»</p>
                            <p className="p-14-18-400">БИН: 170340030332</p>
                            <p className="p-14-18-400">г. Алматы, ул. Желтоксан 110</p>
                            <p className="p-14-18-400">индекс 050016</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
