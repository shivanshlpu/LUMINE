import React from 'react';
import {
    LayoutGrid,
    CalendarPlus,
    History,
    Signal,
    Bell,
    QrCode,
    AlertCircle,
    Headset,
    LogOut,
} from 'lucide-react';
import { useTranslation } from '../context/LanguageContext';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    const logout = () => {
        window.location.href = 'landingpage.html';
    };

    return (
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20 h-full">
            {/* Logo removed to avoid duplication with GovernmentHeader */}

            <nav className="flex-1 overflow-y-auto p-4 space-y-1 no-scrollbar">

                <Link to="/dashboard" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive('/dashboard') ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/20' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-700'}`}>
                    <LayoutGrid className={`w-5 h-5 ${isActive('/dashboard') ? '' : 'group-hover:scale-110 transition-transform'}`} />
                    <span>{t('navDashboard')}</span>
                </Link>

                <Link to="/dashboard/slot-booking" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive('/dashboard/slot-booking') ? 'bg-navy-900 text-white shadow-lg shadow-navy-900/20' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-700'}`}>
                    <CalendarPlus className={`w-5 h-5 ${isActive('/dashboard/slot-booking') ? '' : 'group-hover:scale-110 transition-transform'}`} />
                    <span>{t('navSlotBooking')}</span>
                </Link>

                <Link to="/dashboard/my-visits" className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all group ${isActive('/dashboard/my-visits') ? 'bg-navy-800 text-white font-semibold shadow-lg shadow-navy-900/20' : 'text-gray-500 hover:bg-orange-50 hover:text-orange-700'}`}>
                    <History className={`w-5 h-5 ${isActive('/dashboard/my-visits') ? '' : 'group-hover:scale-110 transition-transform'}`} />
                    <span>{t('navMyVisits')}</span>
                </Link>

                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 font-medium hover:bg-orange-50 hover:text-orange-700 transition-all group">
                    <Signal className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{t('navLaneStatus')}</span>
                </a>

                <div className="my-4 border-t border-gray-100 mx-2"></div>

                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 font-medium hover:bg-orange-50 hover:text-orange-700 transition-all group">
                    <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{t('navAdminNotices')}</span>
                </a>

                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-500 font-medium hover:bg-orange-50 hover:text-orange-700 transition-all group">
                    <QrCode className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{t('navDevoteeQr')}</span>
                </a>

                <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 font-medium hover:bg-red-50 transition-all mt-4 group">
                    <AlertCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>{t('navEmergency')}</span>
                </a>

            </nav>

            <div className="p-4 border-t border-gray-100 bg-gray-50/50">
                <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:text-navy-900 transition-colors text-sm mb-1">
                    <Headset className="w-4 h-4" /> {t('support')}
                </a>
                <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-500 hover:text-red-600 transition-colors text-sm">
                    <LogOut className="w-4 h-4" /> {t('logout')}
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
