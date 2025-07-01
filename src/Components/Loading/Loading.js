import { motion } from "framer-motion";

const Loading = () => {
  return (
    <div className="flex  flex-col gap-y-4 items-center w-full justify-center h-screen bg-[#C5DFE8]">
      <div className="flex items-center gap-4">
        <motion.svg
        viewBox="0 0 517.945 517.945"
        xmlns="http://www.w3.org/2000/svg"
        fill="#FF8E26"
        className="md:w-44 md:h-44 w-32 h-32 text-primaryColor"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        <g>
          <g>
            <g>
              <path
                style={{ fill: "#FF8E26" }}
                d="
                  M428.51,110.435
                  h-97.193
                  V72.312
                  C331.317,32.441,298.892,0,259.013,0
                  c-39.871,0-72.312,32.441-72.312,72.312
                  v38.123
                  H89.427
                  l-17.818,387
                  
                  q0,15 15,15
                  h344.727
                  q15,0 15-15
                  l-17.818-387
                  Z
                  
                  M202.975,72.304
                  c0-30.889,25.158-56.038,56.047-56.038
                  c30.88,0,56.006,25.158,56.006,56.038
                  v38.123
                  H202.975
                  V72.304
                  Z
                "
              />
            </g>
          </g>
        </g>
      </motion.svg>
    </div>
    <motion.div
          className="text-gray-700 text-xl font-bold sm:text-xl md:text-3xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          SND STORE
        </motion.div>
    </div>
  );
};

export default Loading;
