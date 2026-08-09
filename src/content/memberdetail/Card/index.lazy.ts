/**
 * Lazy-loaded Card Components
 * ใช้ React.lazy() เพื่อ code splitting และลด initial bundle size
 * Components จะถูกโหลดเฉพาะเมื่อจำเป็นเท่านั้น
 */

import { lazy } from 'react';

// Main Cards - โหลดเมื่อแสดงหน้าหลัก
export const InformationMember = lazy(() => 
  import('./InformationMember/index').then(module => ({ 
    default: module.default 
  }))
);

export const CloseBalanceMember = lazy(() => 
  import('./CloseBalance').then(module => ({ 
    default: module.default 
  }))
);

export const AppRevenueMember = lazy(() => 
  import('./AppRevenue/index.refactored').then(module => ({ 
    default: module.default 
  }))
);

export const ConquestMissionMember = lazy(() => 
  import('./ConquestMission').then(module => ({ 
    default: module.default 
  }))
);

export const VJMissionMember = lazy(() => 
  import('./VJMission').then(module => ({ 
    default: module.default 
  }))
);

export const VJStarVideoMember = lazy(() => 
  import('./VJStarVideo').then(module => ({ 
    default: module.default 
  }))
);

export const CloseBalanceLastMember = lazy(() => 
  import('./CloseBalanceLast').then(module => ({ 
    default: module.default 
  }))
);

export const MissionCoinWallet = lazy(() => 
  import('./MissionCoinWallet').then(module => ({ 
    default: module.default 
  }))
);

export const UnlockStarLiveMember = lazy(() => 
  import('./UnlockStarLive').then(module => ({ 
    default: module.default 
  }))
);

// Sidebar Cards - โหลดแยกต่างหาก
export const WalletDetails = lazy(() => 
  import('./Wallet').then(module => ({ 
    default: module.default 
  }))
);

export const BonusDetails = lazy(() => 
  import('./Bonus').then(module => ({ 
    default: module.default 
  }))
);

export const PositionDetails = lazy(() => 
  import('./Position/index.refactored').then(module => ({ 
    default: module.default 
  }))
);

export const VJRankDetails = lazy(() => 
  import('./VJRank/index.refactored').then(module => ({ 
    default: module.default 
  }))
);

export const VJRankLastMonthDetails = lazy(() => 
  import('./VJRankLastMonth').then(module => ({ 
    default: module.default 
  }))
);

export const BonusStudyDetails = lazy(() => 
  import('./BonusStudy').then(module => ({ 
    default: module.default 
  }))
);

export const BonusFriendsDetails = lazy(() => 
  import('./BonusFriends').then(module => ({ 
    default: module.default 
  }))
);

export const AddOnsDetails = lazy(() => 
  import('./AddOns').then(module => ({ 
    default: module.default 
  }))
);

