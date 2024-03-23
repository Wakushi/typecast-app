export const TYPECAST_CONTRACT_ABI = [
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
    name: "getMission",
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
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "missions",
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
    ],
    stateMutability: "view",
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
  {
    type: "error",
    name: "TypecastRegistry__TransferFailed",
    inputs: [],
  },
]
