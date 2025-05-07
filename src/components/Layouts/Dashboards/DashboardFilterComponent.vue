<template>
<div>
    <div class="flex justify-between items-center px-4 py-8 bg-gray-100 shadow-md rounded-lg">
        <h2 class="font-bold text-3xl text-gray-800">Dashboard</h2>
        <div class="flex items-center">
            <label for="filter" class="block mb-2 font-semibold text-gray-700 mr-4">Filter by:</label>
            <select id="filter" class="border px-3 py-2 rounded w-full bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="week">Week</option>
                <option value="month">Month</option>
                <option value="quarter">Quarter</option>
                <option value="year">Year</option>
            </select>
        </div>
    </div>
</div>
</template>

