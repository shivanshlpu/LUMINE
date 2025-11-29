import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const GovernmentHeader = ({ fontSize, setFontSize }) => {
    const { language, setLanguage } = useTranslation();

    const handleFontSizeChange = (size) => {
        setFontSize(size);
    };

    const toggleLanguage = () => {
        setLanguage(prev => prev === 'en' ? 'hi' : 'en');
    };

    return (
        <div className="w-full font-sans">
            {/* Top Government Strip */}
            <div className="h-1.5 w-full bg-gradient-to-r from-orange-500 via-white to-green-600"></div>

            {/* Main Header Content */}
            <div className="bg-white border-b border-gray-200 px-4 py-2 md:px-8 flex items-center justify-between shadow-sm">

                {/* Left: Logo & Title */}
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-lg bg-orange-600 flex items-center justify-center text-white text-xl md:text-2xl shadow-md">
                        🕉️
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-lg md:text-xl font-bold text-navy-900 leading-tight tracking-tight">
                            LUMINE
                        </h1>
                        <span className="text-[10px] md:text-xs text-gray-600 font-medium uppercase tracking-wider">
                            {language === 'en' ? 'Temple Management System' : 'मंदिर प्रबंधन प्रणाली'}
                        </span>
                    </div>
                </div>

                {/* Right: Controls */}
                <div className="flex items-center gap-4 md:gap-6">

                    {/* Text Size Controls */}
                    <div className="hidden md:flex items-center border border-gray-300 rounded overflow-hidden bg-gray-50">
                        <button
                            onClick={() => handleFontSizeChange('small')}
                            className={`px-3 py-1 text-xs font-bold hover:bg-gray-200 transition-colors ${fontSize === 'small' ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                            aria-label="Decrease font size"
                        >
                            A-
                        </button>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <button
                            onClick={() => handleFontSizeChange('normal')}
                            className={`px-3 py-1 text-xs font-bold hover:bg-gray-200 transition-colors ${fontSize === 'normal' ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                            aria-label="Reset font size"
                        >
                            A
                        </button>
                        <div className="w-px h-4 bg-gray-300"></div>
                        <button
                            onClick={() => handleFontSizeChange('large')}
                            className={`px-3 py-1 text-xs font-bold hover:bg-gray-200 transition-colors ${fontSize === 'large' ? 'bg-gray-200 text-black' : 'text-gray-600'}`}
                            aria-label="Increase font size"
                        >
                            A+
                        </button>
                    </div>

                    {/* Language Toggle */}
                    <button
                        onClick={toggleLanguage}
                        className="flex items-center gap-2 px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-50 transition-colors text-sm font-medium text-navy-900"
                    >
                        <span>{language === 'en' ? 'English' : 'हिंदी'}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-orange-600 font-bold">{language === 'en' ? 'हिंदी' : 'English'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GovernmentHeader;
