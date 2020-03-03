import { databaseConfig } from './database.cred'
import sha256 from 'sha256'

export const defaultImages = {
  // the images must be inside the src/statics/
  projects: {
    tableBanner: 'images/Project-Search-Banner.v1.png',
    webBanner: 'images/Project-banner.v1.png',
    mainImage: ''
  },
  challenges: {
    tableBanner: 'images/Challenge-Search-Banner.v1.png',
    webBanner: 'images/ChallengeBanner.v1.png',
    mainImage: ''
  }
}

export const firebaseConfigs = databaseConfig

export const layoutConfig = {
  homeName: '',
  homeURL: '',
  companyName: '',
  defaultImg: '',
  // hairCut: false, // feature for later
  challenges: false
}

export const dbMeta = {
  // data_scheme: null, // data scheme will go here
  collections: ['configs', 'projects', 'users', 'challenges'],
  db_version: '0.0.0.0',
  admin: {
    username: 'admin',
    password: sha256('nimda')
  }
}

export const configMeta = {
  config_version: '0.0.0.1',
  ver0_0_0_1: [
    {
      action: 'ADD',
      type: 'OBJECT',
      field: 'challengesConfig',
      data: {
        keywords: []
      }
    },
    {
      action: 'ADD',
      type: 'ARRAY',
      field: 'chipContentType',
      data: [
        { label: 'Custom', value: 'CUSTOM' }
      ]
    },
    {
      action: 'CREATE',
      type: 'OBJECT',
      field: '~root',
      data: {
        extraKeywordsData: {}
      }
    },
    {
      action: 'ADD',
      type: 'OBJECT',
      field: 'projectsConfig',
      data: {
        keywords: []
      }
    }
  ]
  // db: null, // got to remove from actual db
}

// current data model
// 0.0.0.2
// * remove two default chips
// * add chipIcons into the db config
// * config.project.customChips = [
//   { label: 'Video', value: 'movie' },
//   { label: 'Source', value: 'code' },
//   { label: 'Face', value: 'face' },
//   { label: 'DNS', value: 'dns' },
//   { label: 'Extension', value: 'extension' },
//   { label: 'Eco', value: 'eco' },
//   { label: 'Feedback', value: 'feedback' }
// ]

export const configSkeleton = {
  allowedDomain: [],
  bodyContentType: [
    { label: 'Text Box', value: 'TEXT_BOX' },
    { label: 'Unordered List', value: 'UNORDERED_LIST' },
    { label: 'Ordered List', value: 'ORDERED_LIST' },
    { label: 'Event List', value: 'EVENT_LIST' }
  ],
  challengesConfig: {
    keywords: [],
    listingTable: {
      bannerImg: {
        active: false,
        url: ''
      }
    },
    webpage: {
      bannerImg: {
        active: false,
        url: ''
      },
      mainImg: {
        active: false,
        url: ''
      }
    }
  },
  chipContentType: [
    { label: 'Source', value: 'SOURCE' },
    { label: 'Video', value: 'VIDEO' },
    { label: 'Custom', value: 'CUSTOM' }
  ],
  config_version: '0.0.0.2',
  customChips: [
    { label: 'Video', value: 'movie' },
    { label: 'Source', value: 'code' },
    { label: 'Face', value: 'face' },
    { label: 'DNS', value: 'dns' },
    { label: 'Extension', value: 'extension' },
    { label: 'Eco', value: 'eco' },
    { label: 'Feedback', value: 'feedback' }
  ],
  enabledChallenges: layoutConfig.challenges,
  extraKeywordsData: {},
  keywords: {},
  newFlag: 15,
  pagination: 50,
  projectsConfig: {
    keywords: [],
    listingTable: {
      bannerImg: {
        active: false,
        url: ''
      }
    },
    webpage: {
      bannerImg: {
        active: false,
        url: ''
      },
      mainImg: {
        active: false,
        url: ''
      }
    }
  },
  socialNetwork: {
    list: [
      { label: 'GitHub', value: 'github' },
      { label: 'Facebook', value: 'facebook' },
      { label: 'LinkedIn', value: 'linkedin' }
    ],
    use: []
  },
  suggestedKeywords: []
}
