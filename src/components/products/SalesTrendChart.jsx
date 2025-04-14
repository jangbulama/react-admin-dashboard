// import { motion } from "framer-motion";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// const salesData = [
// 	{ month: "Jan", sales: 4000 },
// 	{ month: "Feb", sales: 3000 },
// 	{ month: "Mar", sales: 5000 },
// 	{ month: "Apr", sales: 4500 },
// 	{ month: "May", sales: 6000 },
// 	{ month: "Jun", sales: 5500 },
// ];

// const SalesTrendChart = () => {
// 	return (
// 		<motion.div
// 			className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
// 			initial={{ opacity: 0, y: 20 }}
// 			animate={{ opacity: 1, y: 0 }}
// 			transition={{ delay: 0.3 }}
// 		>
// 			<h2 className='text-xl font-semibold text-gray-100 mb-4'>Sales Trend</h2>
// 			<div style={{ width: "100%", height: 300 }}>
// 				<ResponsiveContainer>
// 					<LineChart data={salesData}>
// 						<CartesianGrid strokeDasharray='3 3' stroke='#374151' />
// 						<XAxis dataKey='month' stroke='#9CA3AF' />
// 						<YAxis stroke='#9CA3AF' />
// 						<Tooltip
// 							contentStyle={{
// 								backgroundColor: "rgba(31, 41, 55, 0.8)",
// 								borderColor: "#4B5563",
// 							}}
// 							itemStyle={{ color: "#E5E7EB" }}
// 						/>
// 						<Legend />
// 						<Line type='monotone' dataKey='sales' stroke='#8B5CF6' strokeWidth={2} />
// 					</LineChart>
// 				</ResponsiveContainer>
// 			</div>
// 		</motion.div>
// 	);
// };
// export default SalesTrendChart;
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState, useEffect } from "react";
// import axios from "axios";

// Sample initial data (to be replaced by dynamic data)
const initialSalesData = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4500 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 5500 },
];

const SalesTrendChart = () => {
  const [salesData, setSalesData] = useState(initialSalesData);

  // Fetch trekking packages and calculate sales data
  useEffect(() => {
    const fetchPackagesAndCalculateSales = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/package');
        const packages = response.data;

        // Example: Calculate sales as price * hypothetical bookings per month
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
        const calculatedSales = months.map((month, index) => {
          // Simulate bookings (e.g., 5 bookings per package per month for simplicity)
          const totalSales = packages.reduce((sum, pkg) => sum + pkg.price * 5, 0);
          return { month, sales: totalSales * (1 + index * 0.1) }; // Simulate growth
        });

        setSalesData(calculatedSales);
      } catch (error) {
        console.error('Error fetching packages for sales trend:', error);
      }
    };

    fetchPackagesAndCalculateSales();
  }, []);

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <h2 className='text-xl font-semibold text-gray-100 mb-4'>Sales Trend (Trekking Packages)</h2>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={salesData}>
            <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
            <XAxis dataKey='month' stroke='#9CA3AF' />
            <YAxis stroke='#9CA3AF' />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(31, 41, 55, 0.8)",
                borderColor: "#4B5563",
              }}
              itemStyle={{ color: "#E5E7EB" }}
            />
            <Legend />
            <Line
              type='monotone'
              dataKey='sales'
              stroke='#8B5CF6'
              strokeWidth={2}
              name='Sales ($)'
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SalesTrendChart;