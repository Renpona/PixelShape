export async function test(apiClient) {
    const stats = await apiClient.apiState();
    console.log("VTube Studio version:", stats.vTubeStudioVersion);
}

export async function test2(plugin) {
    const stats = await plugin.currentModel();
    console.log("VTube Studio model:", stats);
}
