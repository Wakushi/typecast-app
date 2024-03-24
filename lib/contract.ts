export const TYPECAST_CONTRACT_ABI = [
  {
    type: "constructor",
    inputs: [{ name: "_priceFeed", type: "address", internalType: "address" }],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "FUND_WITHDRAWAL_DELAY",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "cancelMission",
    inputs: [{ name: "_devAddress", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "completeMission",
    inputs: [{ name: "_recruiter", type: "address", internalType: "address" }],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getEthPrice",
    inputs: [],
    outputs: [{ name: "", type: "uint256", internalType: "uint256" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMissionByAddresses",
    inputs: [
      { name: "_recruiter", type: "address", internalType: "address" },
      { name: "_devAddress", type: "address", internalType: "address" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct TypecastRegistry.Mission",
        components: [
          {
            name: "devAddress",
            type: "address",
            internalType: "address",
          },
          { name: "devFid", type: "uint256", internalType: "uint256" },
          {
            name: "recruiterAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "recruiterFid",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountDue",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "hiredAt", type: "uint256", internalType: "uint256" },
          {
            name: "completedAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "offerIpfsHash",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getMissionByOfferIpfsHash",
    inputs: [
      { name: "_offerIpfsHash", type: "string", internalType: "string" },
    ],
    outputs: [
      {
        name: "",
        type: "tuple",
        internalType: "struct TypecastRegistry.Mission",
        components: [
          {
            name: "devAddress",
            type: "address",
            internalType: "address",
          },
          { name: "devFid", type: "uint256", internalType: "uint256" },
          {
            name: "recruiterAddress",
            type: "address",
            internalType: "address",
          },
          {
            name: "recruiterFid",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "amountDue",
            type: "uint256",
            internalType: "uint256",
          },
          { name: "hiredAt", type: "uint256", internalType: "uint256" },
          {
            name: "completedAt",
            type: "uint256",
            internalType: "uint256",
          },
          {
            name: "offerIpfsHash",
            type: "string",
            internalType: "string",
          },
        ],
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hire",
    inputs: [
      { name: "_devAddress", type: "address", internalType: "address" },
      { name: "_devFid", type: "uint256", internalType: "uint256" },
      {
        name: "_recruiterFid",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "offerIpfsHash", type: "string", internalType: "string" },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "isOfferClosed",
    inputs: [
      { name: "_offerIpfsHash", type: "string", internalType: "string" },
    ],
    outputs: [{ name: "", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_missionByOfferIpfsHash",
    inputs: [{ name: "offerIpfsHash", type: "string", internalType: "string" }],
    outputs: [
      { name: "devAddress", type: "address", internalType: "address" },
      { name: "devFid", type: "uint256", internalType: "uint256" },
      {
        name: "recruiterAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "recruiterFid",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "amountDue", type: "uint256", internalType: "uint256" },
      { name: "hiredAt", type: "uint256", internalType: "uint256" },
      { name: "completedAt", type: "uint256", internalType: "uint256" },
      { name: "offerIpfsHash", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_missions",
    inputs: [
      { name: "recruiter", type: "address", internalType: "address" },
      { name: "devAddress", type: "address", internalType: "address" },
    ],
    outputs: [
      { name: "devAddress", type: "address", internalType: "address" },
      { name: "devFid", type: "uint256", internalType: "uint256" },
      {
        name: "recruiterAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "recruiterFid",
        type: "uint256",
        internalType: "uint256",
      },
      { name: "amountDue", type: "uint256", internalType: "uint256" },
      { name: "hiredAt", type: "uint256", internalType: "uint256" },
      { name: "completedAt", type: "uint256", internalType: "uint256" },
      { name: "offerIpfsHash", type: "string", internalType: "string" },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "s_offerStatus",
    inputs: [{ name: "offerIpfsHash", type: "string", internalType: "string" }],
    outputs: [{ name: "closed", type: "bool", internalType: "bool" }],
    stateMutability: "view",
  },
  {
    type: "event",
    name: "MissionCancelled",
    inputs: [
      {
        name: "recruiter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "devAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MissionCompleted",
    inputs: [
      {
        name: "recruiter",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "devAddress",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "MissionCreated",
    inputs: [
      {
        name: "recruiter",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "recruiterFid",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "devAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "devFid",
        type: "uint256",
        indexed: true,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "hiredAt",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "offerIpfsHash",
        type: "string",
        indexed: true,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OfferClosed",
    inputs: [
      {
        name: "offerIpfsHash",
        type: "string",
        indexed: true,
        internalType: "string",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "TypecastRegistry__InvalidAddress",
    inputs: [],
  },
  {
    type: "error",
    name: "TypecastRegistry__InvalidAmount",
    inputs: [{ name: "amount", type: "uint256", internalType: "uint256" }],
  },
  {
    type: "error",
    name: "TypecastRegistry__MissionCancelPastDue",
    inputs: [],
  },
  {
    type: "error",
    name: "TypecastRegistry__MissionNotFound",
    inputs: [],
  },
  {
    type: "error",
    name: "TypecastRegistry__MissionNotPastDue",
    inputs: [],
  },
  { type: "error", name: "TypecastRegistry__OfferClosed", inputs: [] },
  {
    type: "error",
    name: "TypecastRegistry__TransferFailed",
    inputs: [],
  },
]
